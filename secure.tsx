export type UserRole = 'Admin' | 'Staff';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  initials: string;
}

const USERS = [
  {
    email: 'preethikaeyecare@gmail.com',
    password: 'admin@peclbmdu',
    name: 'Dr. Preethika',
    role: 'Admin' as UserRole,
    initials: 'DP'
  },
  {
    email: 'eyecarepreethika@gmail.com',
    password: 'staff@peclbmdu',
    name: 'Staff Member',
    role: 'Staff' as UserRole,
    initials: 'SM'
  }
];

export const getByRole = (role: UserRole): User | null => {
  const user = USERS.find(u => u.role === role);
  if (user) {
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      initials: user.initials
    };
  }
  return null;
};

export const authenticate = (email: string, pass: string): User | null => {
  // Simple direct comparison for the requested requirement
  const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
  
  if (user) {
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      initials: user.initials
    };
  }
  
  return null;
};