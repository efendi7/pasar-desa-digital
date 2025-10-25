'use client';

import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function FormTextarea({
  label,
  id,
  className = '',
  ...props
}: FormTextareaProps) {
  const textareaId = id || label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="relative">
      <textarea
        id={textareaId}
        {...props}
        placeholder=" "
        className={`block w-full text-sm rounded-lg border appearance-none focus:outline-none focus:ring-0 peer resize-none transition-colors duration-300
          px-2.5 pb-1.5 pt-3
          bg-white dark:bg-zinc-900
          text-gray-900 dark:text-zinc-100
          border-gray-300 dark:border-zinc-700
          focus:border-green-500 dark:focus:border-green-500
          ${className}`}
      />
      <label
        htmlFor={textareaId}
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
    </div>
  );
}
