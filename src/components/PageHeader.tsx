'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  actionButton?: ReactNode;
  icon?: ReactNode; // untuk ikon opsional
  gradientFrom?: string;
  gradientTo?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  count,
  actionButton,
  icon,
  gradientFrom = 'from-green-50',
  gradientTo = 'to-green-100/50',
}: PageHeaderProps) => {
  return (
    <div
  className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} dark:from-zinc-800 dark:to-zinc-900 px-6 sm:px-8 py-6 border-b border-green-200 dark:border-green-700`}
>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {icon}
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-zinc-300 mt-1">{subtitle}</p>
          )}
          {count !== undefined && (
            <p className="text-gray-600 dark:text-zinc-300 mt-1">
              Total {count} item
            </p>
          )}
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>
    </div>
  );
};
