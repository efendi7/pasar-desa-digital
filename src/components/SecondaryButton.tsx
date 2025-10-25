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
    // 💡 Light mode: abu terang → Dark mode: abu gelap terbalik
    'px-6 py-3 border-2 rounded-xl font-semibold text-center transition-all duration-200',
    'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100',
    'dark:border-zinc-600 dark:text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:hover:border-zinc-500 dark:active:bg-zinc-700/70',
    'focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-1 dark:focus:ring-green-600/40',
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
