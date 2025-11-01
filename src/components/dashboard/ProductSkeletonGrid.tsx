'use client';

export default function ProductSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 shadow-md"
        >
          <div className="h-48 sm:h-56 bg-gray-200 dark:bg-zinc-800"></div>
          <div className="p-5 space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="pt-3 border-t border-border dark:border-zinc-700 mt-3 flex justify-between items-center">
              <div className="h-6 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-3 w-8 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
