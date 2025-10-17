'use client';

import React, { ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode; // ikon kiri opsional
}

export function FormInput({ label, id, className = '', icon, type = 'text', ...props }: FormInputProps) {
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative">
      {/* Ikon kiri */}
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}

      <input
        id={inputId}
        {...props}
        type={inputType}
        placeholder=" "
        className={`block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-500 peer
          ${icon ? 'pl-10' : 'px-2.5'} 
          ${isPassword ? 'pr-10' : ''}
          pb-1.5 pt-3
          ${className}`}
      />

      {/* Label floating */}
      <label
        htmlFor={inputId}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2
          peer-focus:px-2 peer-focus:text-green-600
          peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
          peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
      >
        {label}
      </label>

      {/* Ikon mata untuk password */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
