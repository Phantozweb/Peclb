import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  LogOut, 
  Bell, 
  Search, 
  Eye, 
  TrendingUp, 
  CheckCircle2,
  BarChart3,
  Clock,
  Calendar,
  Filter,
  ChevronDown,
  Plus,
  X,
  UserCircle,
  Pencil,
  History,
  CalendarClock,
  Menu,
  PieChart,
  Activity,
  Trash2,
  AlertTriangle,
  MessageCircle,
  Settings,
  Send,
  Loader2,
  RefreshCcw,
  ThumbsDown,
  MoreHorizontal,
  ThumbsUp,
  ArrowLeft
} from 'lucide-react';
import { User } from './secure';
import { api } from './services/api';

interface DashboardProps {
  onLogout: () => void;
  user: User;
}

// --- Constants ---
const STAFF_MEMBERS = [
  'Dr. Preethika',
  'Keerthi Mathi',
  'Thiruveni',
  'Pressy Lara',
  'Ramaneeshwari',
  'Kaleeswari',
  'Ayyammal',
  'Karthika',
  'Janarthan',
  'Hariharan',
  'Aishwarya'
];

const DEFAULT_TEMPLATES = [
  "Hello {name}, this is from LensBox. Your glasses are ready for pickup.",
  "Hi {name}, reminding you of your eye checkup appointment tomorrow.",
  "Dear {name}, thank you for visiting LensBox. How is your vision now?",
  "Hello {name}, we are running a special offer on frames this week!",
  "Hi {name}, your contact lenses have arrived."
];

// --- Types ---
export interface CallLog {
  id: string;
  patientName: string;
  phoneNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h format for input, formatted for display)
  status: 'Connected' | 'No Answer' | 'Busy' | 'Callback' | 'Wrong Number' | 'Pending';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  feedback: string;
  calledBy: string;
  followUp: {
    required: boolean;
    date?: string;
    staff?: string;
  };
}

// --- Helper Functions ---

const formatToAmPm = (time24: string) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  if (!hours || !minutes) return time24;
  
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  
  return `${h12}:${minutes} ${ampm}`;
};

// --- Helper Components ---

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${active ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, color, onClick, isActive }: { label: string; value: number; icon: React.ReactNode; color: string; onClick?: () => void; isActive?: boolean }) => (
  <div
    onClick={onClick}
    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group h-full flex flex-col justify-between ${isActive ? 'border-primary-500 ring-1 ring-primary-500 shadow-md' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}
  >
    <div className="flex justify-between items-start mb-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      {isActive && <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />}
    </div>
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-xs font-medium text-slate-500 truncate">{label}</p>
    </div>
    <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10 transition-transform group-hover:scale-110 ${color}`} />
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Connected': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'No Answer': 'bg-red-50 text-red-700 border-red-100',
    'Busy': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'Callback': 'bg-orange-50 text-orange-700 border-orange-100',
    'Wrong Number': 'bg-slate-100 text-slate-700 border-slate-200',
    'Pending': 'bg-purple-50 text-purple-600 border-purple-200 dashed border',
  };

  const icons: Record<string, React.ReactNode> = {
    'Connected': <CheckCircle2 size={12} />,
    'No Answer': <Phone size={12} className="rotate-45" />,
    'Busy': <Activity size={12} />,
    'Callback': <History size={12} />,
    'Pending': <Clock size={12} />,
    'Wrong Number': <X size={12} />,
  };

  const style = styles[status] || styles['Pending'];
  const icon = icons[status] || icons['Pending'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {icon}
      {status}
    </span>
  );
};

const SimplePieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;

  if (total === 0) return null;

  return (
    <div className="flex items-center gap-8">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
          {data.map((slice, i) => {
            const angle = (slice.value / total) * 360;
            if (angle === 0) return null;
            
            const x1 = 50 + 50 * Math.cos((Math.PI * currentAngle) / 180);
            const y1 = 50 + 50 * Math.sin((Math.PI * currentAngle) / 180);
            const x2 = 50 + 50 * Math.cos((Math.PI * (currentAngle + angle)) / 180);
            const y2 = 50 + 50 * Math.sin((Math.PI * (currentAngle + angle)) / 180);
            
            const pathData = total === slice.value
              ? `M 50 50 m -50, 0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0`
              : `M 50 50 L ${x1} ${y1} A 50 50 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;

            const el = <path key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="2" />;
            currentAngle += angle;
            return el;
          })}
          <circle cx="50" cy="50" r="35" fill="white" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-2xl font-bold text-slate-800">{total}</span>
          <span className="text-[10px] text-slate-400 uppercase font-medium">Logs</span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((item, i) => {
           const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
           return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <span className="text-xs text-slate-400">{percentage}% ({item.value})</span>
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};

const SimpleBarChart = ({ data, total }: { data: { label: string; value: number; color: string }[], total: number }) => {
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div className="h-full flex items-end justify-between gap-2 pt-4 px-2">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
          <div className="relative w-full flex justify-center h-32 items-end">
            <div 
              className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${item.color} opacity-80 group-hover:opacity-100 relative`}
              style={{ height: `${max > 0 ? (item.value / max) * 100 : 0}%`, minHeight: '4px' }}
            >
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                 {item.value} ({total > 0 ? Math.round(item.value/total*100) : 0}%)
               </div>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium truncate w-full text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

interface LogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CallLog | null;
  user: User;
  onSave: (data: CallLog) => void;
  isSaving: boolean;
}

const LogFormModal = ({ isOpen, onClose, initialData, user, onSave, isSaving }: LogFormModalProps) => {
  if (!isOpen) return null;
  
  const [formData, setFormData] = useState<Partial<CallLog>>(
    initialData || {
      patientName: '',
      phoneNumber: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), // Default to current time 24h
      status: 'Connected',
      sentiment: 'Neutral',
      feedback: '',
      calledBy: user.name, // Default fallback
      followUp: { required: false }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.patientName && formData.phoneNumber) {
      onSave(formData as CallLog);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={isSaving ? undefined : onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
           <h3 className="font-bold text-slate-900 text-lg">{initialData ? 'Edit Call Log' : 'New Call Log'}</h3>
           {!isSaving && <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"><X size={20} /></button>}
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-white">
           <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Patient Name</label>
                <input 
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm disabled:bg-slate-50"
                  value={formData.patientName}
                  onChange={e => setFormData({...formData, patientName: e.target.value})}
                  placeholder="e.g. Rahul Verma"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
                <input 
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm disabled:bg-slate-50"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="+91..."
                />
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Date</label>
                <input 
                  type="date"
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm disabled:bg-slate-50"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Time</label>
                <input 
                  type="time"
                  required
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm disabled:bg-slate-50"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
                <p className="text-[10px] text-slate-400 mt-1 text-right">{formData.time ? formatToAmPm(formData.time as string) : ''}</p>
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Staff Member (Caller)</label>
              <select 
                 required
                 disabled={isSaving}
                 className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none shadow-sm cursor-pointer disabled:bg-slate-50"
                 value={formData.calledBy}
                 onChange={e => setFormData({...formData, calledBy: e.target.value})}
              >
                 <option value="" disabled>Select Staff Member</option>
                 {STAFF_MEMBERS.map(staff => (
                    <option key={staff} value={staff}>{staff}</option>
                 ))}
                 {!STAFF_MEMBERS.includes(user.name) && <option value={user.name}>{user.name} (You)</option>}
              </select>
           </div>

           <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status</label>
                <select 
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none shadow-sm cursor-pointer disabled:bg-slate-50"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                   <option>Connected</option>
                   <option>No Answer</option>
                   <option>Busy</option>
                   <option>Callback</option>
                   <option>Wrong Number</option>
                   <option>Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sentiment</label>
                <select 
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none shadow-sm cursor-pointer disabled:bg-slate-50"
                  value={formData.sentiment}
                  onChange={e => setFormData({...formData, sentiment: e.target.value as any})}
                >
                   <option>Positive</option>
                   <option>Neutral</option>
                   <option>Negative</option>
                </select>
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Notes / Feedback</label>
              <textarea 
                disabled={isSaving}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none h-24 resize-none transition-all shadow-sm disabled:bg-slate-50"
                value={formData.feedback}
                onChange={e => setFormData({...formData, feedback: e.target.value})}
                placeholder="Enter call details..."
              ></textarea>
           </div>
           
           <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button type="button" onClick={onClose} disabled={isSaving} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50">Cancel</button>
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving && <Loader2 className="animate-spin w-4 h-4" />}
                {isSaving ? 'Saving...' : 'Save Record'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

const HistoryModal = ({ isOpen, onClose, phoneNumber, logs }: { isOpen: boolean; onClose: () => void; phoneNumber: string; logs: CallLog[] }) => {
  if (!isOpen) return null;
  const patientLogs = logs.filter(l => l.phoneNumber === phoneNumber).sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
           <div>
             <h3 className="font-bold text-slate-900">Patient History</h3>
             <p className="text-xs text-slate-500 font-mono mt-1">{phoneNumber}</p>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {patientLogs.length > 0 ? (
            <div className="space-y-6">
               {patientLogs.map((log) => (
                 <div key={log.id} className="relative pl-6 border-l-2 border-slate-200 pb-6 last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-50 border-2 border-primary-500 box-content"></div>
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-sm font-semibold text-slate-900">{log.date} <span className="text-slate-400 font-normal">at</span> {formatToAmPm(log.time)}</span>
                       <StatusBadge status={log.status} />
                    </div>
                    <div className="text-sm text-slate-600 mb-2">
                      <span className="font-medium text-slate-700">Staff:</span> {log.calledBy}
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                      "{log.feedback || 'No notes recorded.'}"
                    </p>
                 </div>
               ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <History size={32} className="mx-auto mb-2 opacity-20" />
              <p>No history found for this number.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Template Manager Modal ---
const TemplateManagerModal = ({ isOpen, onClose, templates, onSave, isSaving }: { isOpen: boolean; onClose: () => void; templates: string[]; onSave: (newTemplates: string[]) => void; isSaving: boolean }) => {
  if (!isOpen) return null;
  const [localTemplates, setLocalTemplates] = useState([...templates]);

  const handleChange = (index: number, val: string) => {
    const newTemps = [...localTemplates];
    newTemps[index] = val;
    setLocalTemplates(newTemps);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={isSaving ? undefined : onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
           <div>
             <h3 className="font-bold text-slate-900">Manage Message Templates</h3>
             <p className="text-xs text-slate-500 mt-1">Use <span className="font-mono bg-slate-200 px-1 rounded">{`{name}`}</span> as a placeholder for patient name.</p>
           </div>
           {!isSaving && <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>}
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
           {localTemplates.map((temp, idx) => (
             <div key={idx} className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase">Template {idx + 1}</label>
               <textarea 
                 value={temp}
                 disabled={isSaving}
                 onChange={(e) => handleChange(idx, e.target.value)}
                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 outline-none h-20 resize-none disabled:bg-slate-50"
               />
             </div>
           ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
           <button onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50">Cancel</button>
           <button 
             onClick={() => onSave(localTemplates)}
             disabled={isSaving}
             className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm disabled:opacity-70 flex items-center gap-2"
           >
             {isSaving && <Loader2 className="animate-spin w-4 h-4" />}
             {isSaving ? 'Saving...' : 'Save Templates'}
           </button>
        </div>
      </div>
    </div>
  );
};

// --- WhatsApp Workflow Modal ---
const WhatsAppModal = ({ isOpen, onClose, patient, templates }: { isOpen: boolean; onClose: () => void; patient: CallLog; templates: string[] }) => {
  if (!isOpen) return null;
  
  const [step, setStep] = useState<'select' | 'preview'>('select');
  const [message, setMessage] = useState('');

  const handleSelect = (template: string) => {
    setMessage(template.replace('{name}', patient.patientName));
    setStep('preview');
  };

  const handleSend = () => {
    const rawPhone = patient.phoneNumber ? String(patient.phoneNumber) : '';
    const phone = rawPhone.replace(/[^0-9]/g, ''); 
    // If input is 10 digits, add 91 automatically, otherwise trust the user input
    const finalPhone = phone.length === 10 ? `91${phone}` : phone;
    
    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-emerald-50">
           <div className="flex items-center gap-2">
             <div className="bg-emerald-500 p-1.5 rounded-lg text-white"><MessageCircle size={18} /></div>
             <div>
                <h3 className="font-bold text-slate-900">WhatsApp Message</h3>
                <p className="text-xs text-emerald-700 font-medium">To: {patient.patientName} ({patient.phoneNumber})</p>
             </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        {/* Step 1: Template Selection */}
        {step === 'select' && (
          <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">
             <p className="text-sm text-slate-500 mb-2">Select a template to customize:</p>
             {templates.map((temp, idx) => (
               <button 
                 key={idx}
                 onClick={() => handleSelect(temp)}
                 className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
               >
                 <p className="text-sm text-slate-700 group-hover:text-emerald-900">{temp.replace('{name}', patient.patientName)}</p>
                 <div className="mt-2 flex items-center text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowLeft size={12} className="mr-1 rotate-180" /> Use this template
                 </div>
               </button>
             ))}
          </div>
        )}

        {/* Step 2: Edit & Confirm */}
        {step === 'preview' && (
          <div className="p-6">
             <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Edit Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl text-sm bg-emerald-50/30 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none transition-all shadow-inner"
                />
             </div>
             
             <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setStep('select')}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button 
                  onClick={handleSend}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Open WhatsApp
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
  const isAdmin = user.role === 'Admin';
  
  // State
  const [currentView, setCurrentView] = useState<'overview' | 'patients'>('overview');
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<CallLog | null>(null);
  const [historyPatientPhone, setHistoryPatientPhone] = useState<string | null>(null);
  const [logToDelete, setLogToDelete] = useState<CallLog | null>(null);

  // WhatsApp Feature State
  const [templates, setTemplatesState] = useState<string[]>(DEFAULT_TEMPLATES);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [whatsappTarget, setWhatsappTarget] = useState<CallLog | null>(null);

  // Fetch Data on Mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchInitialData();
      setLogs(data.logs);
      if (data.templates && data.templates.length > 0) {
        setTemplatesState(data.templates);
      }
    } catch (error) {
      console.error("Failed to load data", error);
      alert("Failed to load data from server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Derived Data
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            log.phoneNumber.includes(searchQuery);
      
      // Handle special filters
      let matchesStatus = true;
      if (statusFilter === 'All') {
        matchesStatus = true;
      } else if (statusFilter === 'OTHERS') {
        matchesStatus = ['Busy', 'Callback', 'No Answer', 'Wrong Number'].includes(log.status);
      } else if (statusFilter === 'Pending') {
        matchesStatus = log.status === 'Pending';
      } else {
        matchesStatus = log.status === statusFilter;
      }

      const matchesDate = dateFilter === '' || log.date === dateFilter;
      const matchesSentiment = sentimentFilter === 'All' || log.sentiment === sentimentFilter;

      return matchesSearch && matchesStatus && matchesDate && matchesSentiment;
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  }, [logs, searchQuery, statusFilter, dateFilter, sentimentFilter]);

  // Actions
  const handleSaveLog = async (logData: CallLog) => {
    setIsSaving(true);
    try {
      if (editingLog) {
        await api.updateLog(logData);
        setLogs(prev => prev.map(l => l.id === logData.id ? logData : l));
      } else {
        // Generate ID if missing (critical fix for creation)
        const newLog = { ...logData, id: logData.id || crypto.randomUUID() };
        const res = await api.createLog(newLog);
        
        // If API returns success, use the new data
        setLogs(prev => [newLog, ...prev]);
      }
      setIsAddModalOpen(false);
      setEditingLog(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save log. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (log: CallLog) => {
    setEditingLog(log);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (log: CallLog) => {
    setLogToDelete(log);
  };

  const confirmDelete = async () => {
    if (logToDelete) {
      setIsSaving(true);
      try {
        await api.deleteLog(logToDelete.id);
        setLogs(prev => prev.filter(l => l.id !== logToDelete.id));
        setLogToDelete(null);
      } catch (error) {
        alert("Failed to delete log.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveTemplates = async (newTemplates: string[]) => {
    setIsSaving(true);
    try {
      for (let i = 0; i < newTemplates.length; i++) {
        if (newTemplates[i] !== templates[i]) {
           await api.updateTemplate(i, newTemplates[i]);
        }
      }
      setTemplatesState(newTemplates);
      setIsTemplateManagerOpen(false);
    } catch (error) {
      alert("Failed to save templates.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleHistoryClick = (phone: string) => {
    setHistoryPatientPhone(phone);
  };

  const stats = useMemo(() => {
    const total = logs.length;
    const connected = logs.filter(l => l.status === 'Connected').length;
    const pending = logs.filter(l => l.status === 'Pending').length;
    // Group "Others"
    const others = logs.filter(l => ['Busy', 'Callback', 'No Answer', 'Wrong Number'].includes(l.status)).length;
    const positive = logs.filter(l => l.sentiment === 'Positive').length;
    const negative = logs.filter(l => l.sentiment === 'Negative').length;
    return { total, connected, pending, others, positive, negative };
  }, [logs]);

  // Quick Filter Handlers
  const applyQuickFilter = (type: 'total' | 'connected' | 'pending' | 'others' | 'positive' | 'negative') => {
    // Reset all first
    setStatusFilter('All');
    setSentimentFilter('All');
    setDateFilter('');
    setCurrentView('overview');

    switch(type) {
      case 'total':
        // Already reset
        break;
      case 'connected':
        setStatusFilter('Connected');
        break;
      case 'pending':
        setStatusFilter('Pending');
        break;
      case 'others':
        setStatusFilter('OTHERS'); 
        break;
      case 'positive':
        setSentimentFilter('Positive');
        break;
      case 'negative':
        setSentimentFilter('Negative');
        break;
    }
  };

  // Helper to switch view and close menu
  const navigateTo = (view: 'overview' | 'patients') => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex font-sans overflow-hidden">
      {/* Mobile Menu Overlay - High Z-Index */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-[80] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[80] w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center bg-primary-500 rounded-lg">
               <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LensBox</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isAdmin && (
           <div className="px-6 py-2 shrink-0">
             <span className="text-[10px] bg-primary-900 text-primary-200 px-2 py-1 rounded border border-primary-800 font-medium">ADMIN DASHBOARD</span>
           </div>
        )}

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={currentView === 'overview'} 
            onClick={() => navigateTo('overview')}
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Patients List" 
            active={currentView === 'patients'} 
            onClick={() => navigateTo('patients')}
          />
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto shrink-0">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 relative overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shrink-0 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
             >
               <Menu size={24} />
             </button>
             <span className="font-bold text-slate-900 md:hidden text-lg truncate">LensBox</span>
             <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-100 rounded-xl px-4 py-2 w-96">
               <Search size={18} />
               <input 
                 type="text" 
                 placeholder="Search global records..." 
                 className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
               />
             </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button 
               onClick={loadData}
               disabled={isLoading}
               className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
               title="Refresh Data"
            >
              <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <div className="flex items-center justify-end gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                    <p className="text-xs text-slate-500 uppercase font-medium">{user.role}</p>
                </div>
              </div>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-white text-sm md:text-base
                 ${isAdmin 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                    : 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                 }`}
              >
                {user.initials}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-10 scroll-smooth">
           <div className="space-y-6 md:space-y-10 animate-fade-in-up pb-20 max-w-[1600px] mx-auto">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                    {currentView === 'overview' ? (isAdmin ? 'Admin Master Dashboard' : 'Communication Reports') : 'Patient Directory'}
                  </h1>
                  <p className="text-slate-500 mt-1 text-sm md:text-base">
                    {currentView === 'overview' 
                      ? (isAdmin ? 'Comprehensive analytics, staff performance, and patient records.' : 'Real-time analytics and call status tracking.')
                      : 'Manage and view all patient call logs and history.'
                    }
                  </p>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  {isAdmin && (
                    <button 
                      onClick={() => setIsTemplateManagerOpen(true)}
                      className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings size={18} />
                      Templates
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setEditingLog(null);
                      setIsAddModalOpen(true);
                    }}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Call Log
                  </button>
                </div>
              </div>

              {/* OVERVIEW CONTENT (Stats + Charts) - Only shown in Overview view */}
              {currentView === 'overview' && (
                <>
                  {/* Top Stats Cards - 6 Columns */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                     <StatCard 
                        label="Total Calls" 
                        value={stats.total} 
                        icon={<Phone size={16} />} 
                        color="bg-blue-500" 
                        onClick={() => applyQuickFilter('total')}
                        isActive={statusFilter === 'All' && sentimentFilter === 'All'}
                     />
                     <StatCard 
                        label="Connected" 
                        value={stats.connected} 
                        icon={<CheckCircle2 size={16} />} 
                        color="bg-emerald-500" 
                        onClick={() => applyQuickFilter('connected')}
                        isActive={statusFilter === 'Connected'}
                     />
                     <StatCard 
                        label="Pending" 
                        value={stats.pending} 
                        icon={<Clock size={16} />} 
                        color="bg-purple-500" 
                        onClick={() => applyQuickFilter('pending')}
                        isActive={statusFilter === 'Pending'}
                     />
                     <StatCard 
                        label="Others" 
                        value={stats.others} 
                        icon={<MoreHorizontal size={16} />} 
                        color="bg-orange-500" 
                        onClick={() => applyQuickFilter('others')}
                        isActive={statusFilter === 'OTHERS'}
                     />
                     <StatCard 
                        label="Positive" 
                        value={stats.positive} 
                        icon={<ThumbsUp size={16} />} 
                        color="bg-teal-500" 
                        onClick={() => applyQuickFilter('positive')}
                        isActive={sentimentFilter === 'Positive'}
                     />
                     <StatCard 
                        label="Negative" 
                        value={stats.negative} 
                        icon={<ThumbsDown size={16} />} 
                        color="bg-red-500" 
                        onClick={() => applyQuickFilter('negative')}
                        isActive={sentimentFilter === 'Negative'}
                     />
                  </div>

                  {/* ADMIN ONLY: Analytics Section */}
                  {isAdmin && (
                    <div className="space-y-6">
                      {/* Charts Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         {/* Sentiment Pie Chart */}
                         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                 <PieChart size={18} className="text-primary-600"/> Sentiment Analysis
                               </h3>
                            </div>
                            <div className="flex-1 flex items-center justify-center min-h-[200px]">
                               {logs.length > 0 ? (
                                 <SimplePieChart data={[
                                   { label: 'Positive', value: logs.filter(l => l.sentiment === 'Positive').length, color: '#10b981' },
                                   { label: 'Neutral', value: logs.filter(l => l.sentiment === 'Neutral').length, color: '#64748b' },
                                   { label: 'Negative', value: logs.filter(l => l.sentiment === 'Negative').length, color: '#ef4444' },
                                 ]} />
                               ) : (
                                 <div className="text-slate-400 text-sm flex flex-col items-center">
                                   <div className="w-24 h-24 rounded-full border-4 border-slate-100 mb-2"></div>
                                   No data available
                                 </div>
                               )}
                            </div>
                         </div>

                         {/* Call Status Bar Chart */}
                         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                 <BarChart3 size={18} className="text-blue-600"/> Call Outcomes
                               </h3>
                            </div>
                            <div className="flex-1 min-h-[200px]">
                               {logs.length > 0 ? (
                                 <SimpleBarChart data={[
                                   { label: 'Connected', value: logs.filter(l => l.status === 'Connected').length, color: 'bg-emerald-500' },
                                   { label: 'No Answer', value: logs.filter(l => l.status === 'No Answer').length, color: 'bg-red-500' },
                                   { label: 'Callback', value: logs.filter(l => l.status === 'Callback').length, color: 'bg-orange-500' },
                                   { label: 'Busy', value: logs.filter(l => l.status === 'Busy').length, color: 'bg-yellow-500' },
                                   { label: 'Wrong No', value: logs.filter(l => l.status === 'Wrong Number').length, color: 'bg-slate-500' },
                                 ]} total={logs.length} />
                               ) : (
                                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data available</div>
                               )}
                            </div>
                         </div>
                      </div>

                      {/* Staff Performance Table */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                           <h3 className="font-bold text-slate-900 flex items-center gap-2">
                             <Users size={18} className="text-purple-600"/> Staff Performance
                           </h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                              <tr>
                                <th className="px-6 py-3">Staff Member</th>
                                <th className="px-6 py-3 text-center">Calls Handled</th>
                                <th className="px-6 py-3 text-center">Positive Outcomes</th>
                                <th className="px-6 py-3 text-center">Efficiency</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {STAFF_MEMBERS.map((staff) => {
                                 const staffLogs = logs.filter(l => l.calledBy === staff);
                                 const total = staffLogs.length;
                                 const positive = staffLogs.filter(l => l.sentiment === 'Positive').length;
                                 const efficiency = total > 0 ? Math.round((positive / total) * 100) : 0;
                                 
                                 return (
                                   <tr key={staff} className="hover:bg-slate-50 transition-colors">
                                     <td className="px-6 py-3 font-medium text-slate-900">{staff}</td>
                                     <td className="px-6 py-3 text-center text-slate-600">{total > 0 ? total : '-'}</td>
                                     <td className="px-6 py-3 text-center text-emerald-600 font-medium">{positive > 0 ? positive : '-'}</td>
                                     <td className="px-6 py-3 text-center">
                                       {total > 0 ? (
                                         <div className="flex items-center justify-center gap-2">
                                           <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                             <div className="h-full bg-purple-500 rounded-full" style={{ width: `${efficiency}%` }}></div>
                                           </div>
                                           <span className="text-xs font-bold text-slate-700">{efficiency}%</span>
                                         </div>
                                       ) : <span className="text-slate-400">-</span>}
                                     </td>
                                   </tr>
                                 );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Patient Records Section */}
              <div className={`${currentView === 'overview' ? 'pt-4 border-t border-slate-200/50' : ''}`}>
                <h2 className={`text-lg font-bold text-slate-900 mb-4 ${currentView === 'patients' ? 'hidden' : ''}`}>Patient Call Records</h2>
                
                {/* Filter Bar */}
                <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between mb-6">
                   <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                     {/* Search */}
                     <div className="relative group w-full md:w-64">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
                       <input 
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Search name or phone..." 
                         className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-slate-900"
                       />
                     </div>

                     {/* Status Filter */}
                     <div className="relative w-full md:w-48">
                       <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <select 
                         value={statusFilter}
                         onChange={(e) => setStatusFilter(e.target.value)}
                         className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white appearance-none text-slate-900 cursor-pointer"
                       >
                         <option value="All">All Statuses</option>
                         <option value="Connected">Connected</option>
                         <option value="Pending">Pending</option>
                         <option value="OTHERS">Others / Follow-up</option>
                         <option value="No Answer">No Answer</option>
                         <option value="Busy">Busy</option>
                         <option value="Wrong Number">Wrong Number</option>
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                     </div>

                     {/* Date Filter */}
                     <div className="relative w-full md:w-48">
                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                         type="date" 
                         value={dateFilter}
                         onChange={(e) => setDateFilter(e.target.value)}
                         className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-slate-900"
                       />
                     </div>
                   </div>
                   
                   {(searchQuery || statusFilter !== 'All' || dateFilter || sentimentFilter !== 'All') && (
                     <button 
                       onClick={() => { setSearchQuery(''); setStatusFilter('All'); setDateFilter(''); setSentimentFilter('All'); }}
                       className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center justify-center gap-1 py-1"
                     >
                       <X size={12} /> Clear Filters
                     </button>
                   )}
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative min-h-[300px]">
                   {isLoading && (
                     <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                       <div className="flex flex-col items-center gap-3">
                         <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                         <span className="text-sm font-medium text-slate-600">Syncing with database...</span>
                       </div>
                     </div>
                   )}
                   
                   <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left min-w-[800px]">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 whitespace-nowrap w-32">Date & Time</th>
                            <th className="px-6 py-4 w-48">Patient Details</th>
                            <th className="px-6 py-4 w-32">Call Status</th>
                            <th className="px-6 py-4">Feedback / Note</th>
                            <th className="px-6 py-4 w-40">Staff</th>
                            <th className="px-6 py-4 text-right w-32">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap align-top">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-slate-900">{log.date}</span>
                                    <span className="text-xs text-slate-500">{formatToAmPm(log.time)}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 align-top">
                                   <div>
                                     <p className="font-bold text-slate-900">{log.patientName}</p>
                                     <p className="text-xs text-slate-500 font-mono mt-0.5">{log.phoneNumber}</p>
                                   </div>
                                </td>
                                <td className="px-6 py-4 align-top">
                                  <StatusBadge status={log.status} />
                                </td>
                                <td className="px-6 py-4 align-top">
                                   <p className="text-slate-600 line-clamp-2 text-xs md:text-sm" title={log.feedback}>
                                     {log.feedback}
                                   </p>
                                   {log.sentiment !== 'Neutral' && (
                                     <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded border ${
                                       log.sentiment === 'Positive' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'
                                     }`}>
                                       {log.sentiment}
                                     </span>
                                   )}
                                </td>
                                <td className="px-6 py-4 align-top">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                                        {log.calledBy.charAt(0)}
                                     </div>
                                     <span className="text-slate-600 text-xs truncate">{log.calledBy}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right align-top">
                                   <div className="flex items-center justify-end gap-1.5 opacity-100">
                                      <button 
                                        onClick={() => setWhatsappTarget(log)}
                                        className="p-1.5 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                        title="WhatsApp Message"
                                      >
                                         <MessageCircle size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleHistoryClick(log.phoneNumber)}
                                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="View History"
                                      >
                                         <History size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleEditClick(log)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Log"
                                      >
                                         <Pencil size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteClick(log)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Log"
                                      >
                                         <Trash2 size={16} />
                                      </button>
                                   </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                 <div className="flex flex-col items-center gap-2">
                                   <Search size={32} className="opacity-20" />
                                   <p>{isLoading ? 'Loading records...' : 'No call logs found matching your filters.'}</p>
                                   {statusFilter === 'OTHERS' && (
                                     <p className="text-xs text-orange-500">Filtering for Busy, Callback, No Answer, & Wrong Number</p>
                                   )}
                                 </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                   </div>
                   
                   {/* Simple Pagination Footer */}
                   <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                      <span>Showing {filteredLogs.length} records</span>
                      <div className="flex gap-2">
                         <button disabled className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Prev</button>
                         <button disabled className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Next</button>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* --- MODALS --- */}

        {/* Add/Edit Log Modal */}
        {isAddModalOpen && (
          <LogFormModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            initialData={editingLog}
            user={user}
            onSave={handleSaveLog}
            isSaving={isSaving}
          />
        )}

        {/* Delete Confirmation Modal */}
        {logToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={isSaving ? undefined : () => setLogToDelete(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                     <AlertTriangle className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Call Log?</h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Are you sure you want to delete the log for <span className="font-semibold text-slate-700">{logToDelete.patientName}</span>? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 w-full">
                     <button 
                       onClick={() => setLogToDelete(null)}
                       disabled={isSaving}
                       className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={confirmDelete}
                       disabled={isSaving}
                       className="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                     >
                       {isSaving && <Loader2 className="animate-spin w-3 h-3" />}
                       {isSaving ? 'Deleting' : 'Delete'}
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Template Manager (Admin Only) */}
        {isTemplateManagerOpen && (
           <TemplateManagerModal 
             isOpen={isTemplateManagerOpen}
             onClose={() => setIsTemplateManagerOpen(false)}
             templates={templates}
             onSave={handleSaveTemplates}
             isSaving={isSaving}
           />
        )}

        {/* WhatsApp Modal with Workflow */}
        {whatsappTarget && (
          <WhatsAppModal 
            isOpen={!!whatsappTarget}
            onClose={() => setWhatsappTarget(null)}
            patient={whatsappTarget}
            templates={templates}
          />
        )}

        {/* History Modal */}
        {historyPatientPhone && (
          <HistoryModal 
            isOpen={!!historyPatientPhone}
            onClose={() => setHistoryPatientPhone(null)}
            phoneNumber={historyPatientPhone}
            logs={logs}
          />
        )}

      </main>
    </div>
  );
};