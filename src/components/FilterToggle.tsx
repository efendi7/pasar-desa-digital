'use client';

import { Sparkles, TrendingUp } from 'lucide-react';

interface FilterToggleProps {
  activeFilter: 'latest' | 'popular';
  onFilterChange: (filter: 'latest' | 'popular') => void;
}

export function FilterToggle({
  activeFilter,
  onFilterChange,
}: FilterToggleProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Tombol "Terbaru" */}
      <button
        onClick={() => onFilterChange('latest')}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out min-w-[140px] border-2 group
          ${
            activeFilter === 'latest'
              // Gaya aktif
              ? 'bg-green-50 border-green-500 text-green-700 shadow-sm scale-105 dark:bg-green-500/20 dark:border-green-400 dark:text-green-300'
              // Gaya tidak aktif
              : 'bg-white border-zinc-200 text-zinc-600 hover:border-green-500 hover:text-green-700 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-green-400 dark:hover:text-green-400'
          }`}
      >
        <Sparkles
          className={`w-5 h-5 transition-all duration-300 
            ${
              activeFilter === 'latest'
                ? 'text-green-600 dark:text-green-400'
                : 'text-zinc-500 dark:text-zinc-500 group-hover:text-green-600 dark:group-hover:text-green-400'
            }`}
        />
        <span>Terbaru</span>
      </button>

      {/* Tombol "Terpopuler" */}
      <button
        onClick={() => onFilterChange('popular')}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out min-w-[140px] border-2 group
          ${
            activeFilter === 'popular'
              // Gaya aktif
              ? 'bg-green-50 border-green-500 text-green-700 shadow-sm scale-105 dark:bg-green-500/20 dark:border-green-400 dark:text-green-300'
              // Gaya tidak aktif
              : 'bg-white border-zinc-200 text-zinc-600 hover:border-green-500 hover:text-green-700 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-green-400 dark:hover:text-green-400'
          }`}
      >
        <TrendingUp
          className={`w-5 h-5 transition-all duration-300 
            ${
              activeFilter === 'popular'
                ? 'text-green-600 dark:text-green-400'
                : 'text-zinc-500 dark:text-zinc-500 group-hover:text-green-600 dark:group-hover:text-green-400'
            }`}
        />
        <span>Terpopuler</span>
      </button>
    </div>
  );
}