'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

interface FilterToggleProps {
  activeFilter: 'latest' | 'popular';
  onFilterChange: (filter: 'latest' | 'popular') => void;
}

export function FilterToggle({ activeFilter, onFilterChange }: FilterToggleProps) {
  return (
    <div className="relative flex items-center w-[280px] h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full shadow-inner border border-zinc-200 dark:border-zinc-700 overflow-hidden select-none">
      {/* Background geser */}
      <motion.div
        layout
        className="absolute top-0 bottom-0 w-1/2 bg-green-500/20 border border-green-400/40 pointer-events-none"
        animate={{
          x: activeFilter === 'popular' ? '100%' : '0%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          borderRadius:
            activeFilter === 'latest'
              ? '9999px 0 0 9999px'
              : '0 9999px 9999px 0',
        }}
      />

      {/* Seluruh sisi kiri (Terbaru) klikable */}
      <div
        onClick={() => onFilterChange('latest')}
        className={`relative z-10 flex-1 h-full flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300 font-semibold
          ${
            activeFilter === 'latest'
              ? 'text-green-700 dark:text-green-300'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-300'
          }`}
      >
        <Sparkles
          className={`w-5 h-5 transition-all ${
            activeFilter === 'latest'
              ? 'text-green-600 dark:text-green-400'
              : 'text-zinc-500 dark:text-zinc-500'
          }`}
        />
        <span>Terbaru</span>
      </div>

      {/* Seluruh sisi kanan (Terpopuler) klikable */}
      <div
        onClick={() => onFilterChange('popular')}
        className={`relative z-10 flex-1 h-full flex items-center justify-center gap-2 cursor-pointer transition-colors duration-300 font-semibold
          ${
            activeFilter === 'popular'
              ? 'text-green-700 dark:text-green-300'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-300'
          }`}
      >
        <TrendingUp
          className={`w-5 h-5 transition-all ${
            activeFilter === 'popular'
              ? 'text-green-600 dark:text-green-400'
              : 'text-zinc-500 dark:text-zinc-500'
          }`}
        />
        <span>Terpopuler</span>
      </div>
    </div>
  );
}
