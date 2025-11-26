'use client';

import React, { ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export function FormInput({
  label,
  id,
  className = '',
  icon,
  type = 'text',
  ...props
}: FormInputProps) {
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        id={inputId}
        type={inputType}
        placeholder=" "
        {...props}
        className={`
          block w-full text-sm rounded-lg border
          bg-white dark:bg-zinc-900
          text-gray-900 dark:text-zinc-100
          border-gray-300 dark:border-zinc-700

          pt-4 pb-1.5 
          ${icon ? 'pl-10' : 'pl-3'}
          ${isPassword ? 'pr-10' : 'pr-3'}

          focus:ring-0 focus:border-green-600 dark:focus:border-green-500

          appearance-none peer transition-all
          ${className}
        `}
      />

      {/* Label berada DI DALAM FIELD */}
      <label
        htmlFor={inputId}
        className={`
          absolute left-${icon ? '10' : '3'} text-gray-500 dark:text-zinc-400
          pointer-events-none bg-white dark:bg-zinc-900 px-1

          transition-all duration-200 ease-out

          /* Posisi awal (di dalam input) */
          top-1/2 -translate-y-1/2 text-sm

          /* Saat input fokus */
          peer-focus:top-1 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-green-600 dark:peer-focus:text-green-400

          /* Saat ada value */
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
          peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:-translate-y-3 peer-not-placeholder-shown:text-xs
        `}
      >
        {label}
      </label>

      {/* Ikon kiri */}
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
          {icon}
        </div>
      )}

      {/* Tombol mata */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-600"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
}
