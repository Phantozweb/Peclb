import React from 'react';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from '../types';

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] transition-transform";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm shadow-primary-500/30",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm",
    outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
  };

  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      
      {children}

      {!isLoading && rightIcon ? (
        <span className="ml-2">{rightIcon}</span>
      ) : null}
    </button>
  );
};