'use client';

export default function UserStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 rounded-xl p-4 sm:p-6"
        >
          <div className="h-4 w-1/3 bg-emerald-100 dark:bg-zinc-800 rounded mb-3"></div>
          <div className="h-6 w-1/2 bg-emerald-100 dark:bg-zinc-800 rounded"></div>
        </div>
      ))}
    </div>
  );
}
