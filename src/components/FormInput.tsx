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
    <div className="w-full flex items-start gap-2">
      {/* === Ikon di luar field === */}
      {icon && (
        <div className="pt-4 text-zinc-500 dark:text-zinc-400">
          {icon}
        </div>
      )}

      {/* === Wrapper input & label === */}
      <div className="relative w-full">
        <input
          id={inputId}
          type={inputType}
          placeholder={props.placeholder && props.value ? props.placeholder : ""}
          {...props}
          className={`
            block w-full text-sm rounded-lg border
            bg-white dark:bg-zinc-900
            text-gray-900 dark:text-zinc-100
            border-gray-300 dark:border-zinc-700

            pt-4 pb-1.5 px-3
            ${isPassword ? 'pr-10' : ''}

            focus:ring-0 focus:border-green-600 dark:focus:border-green-500

            appearance-none peer transition-all
            ${className}
          `}
        />

        {/* Label floating */}
        <label
          htmlFor={inputId}
          className={`
            absolute left-3 text-gray-500 dark:text-zinc-400
            pointer-events-none bg-white dark:bg-zinc-900 px-1
            transition-all duration-200 ease-out

            top-1/2 -translate-y-1/2 text-sm
            peer-focus:top-1 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-green-600 dark:peer-focus:text-green-400

            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
            peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:-translate-y-3 peer-not-placeholder-shown:text-xs
          `}
        >
          {label}
        </label>

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}
