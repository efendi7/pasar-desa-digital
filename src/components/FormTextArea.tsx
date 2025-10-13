'use client';

import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function FormTextarea({ label, id, className = '', ...props }: FormTextareaProps) {
  const textareaId = id || label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="relative">
      <textarea
        id={textareaId}
        {...props}
        placeholder=" "
        className={`block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-500 peer resize-none ${className}`}
      />
      <label
        htmlFor={textareaId}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
      >
        {label}
      </label>
    </div>
  );
}