'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function PrimaryButton({
  loading,
  icon,
  children,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        // ✅ Tambahkan cursor-pointer di sini
        'flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer',
        'bg-green-700 text-white hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg',
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        icon && <span className="w-5 h-5">{icon}</span>
      )}
      {loading ? 'Menyimpan...' : children}
    </button>
  );
}
