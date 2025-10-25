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
    <div className="relative">
      {/* Ikon kiri */}
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
          {icon}
        </div>
      )}

      {/* Input utama */}
      <input
        id={inputId}
        {...props}
        type={inputType}
        placeholder=" "
        className={`block w-full text-sm rounded-lg border appearance-none focus:outline-none focus:ring-0 peer transition-colors duration-300
          ${icon ? 'pl-10' : 'px-2.5'}
          ${isPassword ? 'pr-10' : ''}
          pb-1.5 pt-3
          bg-white dark:bg-zinc-900
          text-gray-900 dark:text-zinc-100
          border-gray-300 dark:border-zinc-700
          focus:border-green-500 dark:focus:border-green-500
          ${className}`}
      />

      {/* Label floating */}
      <label
        htmlFor={inputId}
        className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] px-2
          bg-white dark:bg-zinc-900
          text-gray-500 dark:text-zinc-400
          peer-focus:text-green-600 dark:peer-focus:text-green-400
          peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
          peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1
          transition-all`}
      >
        {label}
      </label>

      {/* Ikon mata untuk password */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          tabIndex={-1}
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
