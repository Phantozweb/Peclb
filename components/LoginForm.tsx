import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Input } from './Input';
import { authenticate, User } from '../secure';

interface LoginFormProps {
  onLogin?: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Basic Validation
    let hasError = false;
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      hasError = true;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    // Simulate network delay for realism
    setTimeout(() => {
      const user = authenticate(email, password);
      
      if (user) {
        setIsSuccess(true);
        setAuthenticatedUser(user);
        setTimeout(() => {
          if (onLogin) onLogin(user);
        }, 1000);
      } else {
        setErrors({ auth: 'Invalid email or password' });
        setIsLoading(false);
      }
    }, 800);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25"></div>
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shadow-sm relative z-10 border border-emerald-200">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Access Granted</h3>
          <p className="text-slate-500">
            Welcome back, <span className="font-semibold text-slate-900">{authenticatedUser?.name}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.auth && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} />
          {errors.auth}
        </div>
      )}

      <div className="space-y-5">
        <div className="group">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="name@lensbox.com"
            leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
            className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white transition-colors"
          />
        </div>

        <div className="relative group">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
            leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full relative group overflow-hidden rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-slate-800 hover:shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying Credentials...</span>
          </span>
        ) : (
          <span className="relative flex items-center justify-center gap-2">
             <span>Sign In to Dashboard</span>
             <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </button>
    </form>
  );
};