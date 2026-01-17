import { CallLog } from '../Dashboard';

const API_URL = "https://script.google.com/macros/s/AKfycbzyVrnfbXRE6QRK21ko-mOawkcxP5g_3-FcqGVZQ3Fxc9KBPJQfcGOrOelTpIbA6Yt1qw/exec";

// --- Types mapping Backend Columns ---
interface SheetLog {
  id: string;
  created_at: string;
  patient_name: string;
  phone_number: string;
  date: string;
  time: string;
  status: string;
  sentiment: string;
  feedback: string;
  called_by: string;
  follow_up_required: boolean | string;
  follow_up_date: string;
  follow_up_staff: string;
}

interface SheetTemplate {
  id: number | string;
  message_content: string;
}

export const api = {
  /**
   * Fetch all data (Logs, Templates, Staff)
   */
  fetchInitialData: async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (data.status !== 'success') throw new Error(data.message || 'Failed to fetch');

      // Transform Logs: Snake_case (Sheet) -> CamelCase (App)
      // Filter out rows where id or patient_name is missing (empty sheet rows)
      const logs: CallLog[] = (data.logs || [])
        .filter((row: any) => row.id && row.patient_name && String(row.id).trim() !== '')
        .map((row: any) => ({
          id: row.id.toString(),
          patientName: row.patient_name,
          phoneNumber: row.phone_number,
          date: row.date ? row.date.split('T')[0] : '', // Handle ISO strings if GAS returns them
          time: row.time,
          status: row.status,
          sentiment: row.sentiment,
          feedback: row.feedback,
          calledBy: row.called_by,
          followUp: {
            required: row.follow_up_required === true || row.follow_up_required === "TRUE",
            date: row.follow_up_date ? row.follow_up_date.split('T')[0] : '',
            staff: row.follow_up_staff
          }
        }));

      // Transform Templates
      // Assumes templates are stored with IDs 1, 2, 3...
      const templates = (data.templates || [])
        .sort((a: any, b: any) => Number(a.id) - Number(b.id))
        .map((t: any) => t.message_content);

      return { logs, templates };
    } catch (error) {
      console.error("API Fetch Error:", error);
      throw error;
    }
  },

  /**
   * Create a new Call Log
   */
  createLog: async (log: CallLog) => {
    // Transform CamelCase -> Snake_case
    const payload = {
      action: 'create',
      table: 'Call_Logs',
      data: {
        id: log.id,
        patient_name: log.patientName,
        phone_number: log.phoneNumber,
        date: log.date,
        time: log.time,
        status: log.status,
        sentiment: log.sentiment,
        feedback: log.feedback,
        called_by: log.calledBy,
        follow_up_required: log.followUp.required,
        follow_up_date: log.followUp.date || '',
        follow_up_staff: log.followUp.staff || ''
      }
    };

    return await sendRequest(payload);
  },

  /**
   * Update an existing Call Log
   */
  updateLog: async (log: CallLog) => {
    const payload = {
      action: 'update',
      table: 'Call_Logs',
      data: {
        id: log.id,
        patient_name: log.patientName,
        phone_number: log.phoneNumber,
        date: log.date,
        time: log.time,
        status: log.status,
        sentiment: log.sentiment,
        feedback: log.feedback,
        called_by: log.calledBy,
        follow_up_required: log.followUp.required,
        follow_up_date: log.followUp.date || '',
        follow_up_staff: log.followUp.staff || ''
      }
    };

    return await sendRequest(payload);
  },

  /**
   * Delete a Call Log
   */
  deleteLog: async (id: string) => {
    const payload = {
      action: 'delete',
      table: 'Call_Logs',
      data: { id }
    };
    return await sendRequest(payload);
  },

  /**
   * Update a specific template by ID
   * Note: The sheet expects IDs 1, 2, 3, 4, 5
   */
  updateTemplate: async (index: number, content: string) => {
    // Index 0 -> ID 1
    const payload = {
      action: 'update',
      table: 'Templates',
      data: {
        id: index + 1,
        message_content: content
      }
    };
    return await sendRequest(payload);
  },
  
  /**
   * Create a template if it doesn't exist (fallback)
   */
  createTemplate: async (index: number, content: string) => {
    const payload = {
      action: 'create',
      table: 'Templates',
      data: {
        id: index + 1,
        message_content: content
      }
    };
    return await sendRequest(payload);
  }
};

/**
 * Helper to send POST requests to GAS
 * We use 'text/plain' to avoid CORS Preflight (OPTIONS) requests which GAS doesn't handle.
 */
async function sendRequest(payload: any) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}