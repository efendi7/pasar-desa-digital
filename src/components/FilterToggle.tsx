'use client';

import { Sparkles, TrendingUp } from 'lucide-react';

interface FilterToggleProps {
  activeFilter: 'latest' | 'popular';
  onFilterChange: (filter: 'latest' | 'popular') => void;
}

export function FilterToggle({ activeFilter, onFilterChange }: FilterToggleProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Tombol "Terbaru" */}
      <button
        onClick={() => onFilterChange('latest')}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out min-w-[140px] border-2 group
          ${
            activeFilter === 'latest'
              // Gaya aktif: Mirip state hover admin, tapi permanen
              ? 'bg-green-50 border-green-500 text-green-700 shadow-sm scale-105'
              // Gaya tidak aktif: Mirip state default admin
              : 'bg-white border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-700'
          }`}
      >
        <Sparkles
          className={`w-5 h-5 transition-all duration-300 
            ${activeFilter === 'latest' ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'}`}
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
              ? 'bg-green-50 border-green-500 text-green-700 shadow-sm scale-105'
              // Gaya tidak aktif
              : 'bg-white border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-700'
          }`}
      >
        <TrendingUp
          className={`w-5 h-5 transition-all duration-300 
            ${activeFilter === 'popular' ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'}`}
        />
        <span>Terpopuler</span>
      </button>
    </div>
  );
}