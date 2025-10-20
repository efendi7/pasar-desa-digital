'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export const Pagination = React.memo(function Pagination({
  currentPage,
  totalItems,
  itemsPerPage = 8,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const handleChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Batasi tombol halaman biar nggak terlalu banyak (tampilkan 1, ..., tengah, ..., terakhir)
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (page) =>
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 2 && page <= currentPage + 2)
    );

  return (
    <div className="flex flex-col items-center justify-center gap-3 mt-10">
      {/* Tombol navigasi */}
      <div className="flex justify-center items-center gap-2">
        {/* Tombol Sebelumnya */}
        <button
          onClick={() => handleChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            currentPage === 1
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {/* Tombol halaman */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index, arr) => (
            <React.Fragment key={page}>
              {index > 0 && arr[index - 1] !== page - 1 && (
                <span className="px-2 text-gray-400">…</span>
              )}
              <button
                onClick={() => handleChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-green-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Tombol Berikutnya */}
        <button
          onClick={() => handleChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Info halaman */}
      <p className="text-xs text-gray-500">
        Halaman <span className="font-semibold">{currentPage}</span> dari{' '}
        <span className="font-semibold">{totalPages}</span>
      </p>
    </div>
  );
});
