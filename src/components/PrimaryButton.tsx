'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'active' | 'inactive';
}

export function PrimaryButton({
  loading,
  icon,
  children,
  className,
  disabled,
  variant = 'primary',
  ...props
}: PrimaryButtonProps) {
  const variantStyles = {
    primary: 'bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg',
    active: 'bg-green-700 text-white hover:bg-green-800 shadow-lg scale-105 ring-2 ring-green-400 ring-offset-2',
    inactive: 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer',
        'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none',
        variantStyles[variant],
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      )}
      {loading ? 'Memuat...' : children}
    </button>
  );
}