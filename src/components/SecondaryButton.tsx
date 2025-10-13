'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface SecondaryButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function SecondaryButton({ href, onClick, children, className }: SecondaryButtonProps) {
  const baseClass = clsx(
    'px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 text-center transition-all',
    'hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100',
    className
  );

  return href ? (
    <Link href={href} className={baseClass}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={baseClass}>
      {children}
    </button>
  );
}
