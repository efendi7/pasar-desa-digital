// src/components/ui/ProductSkeleton.tsx
export function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-700 rounded-lg p-4 space-y-3">
      <div className="w-full h-40 bg-emerald-100 dark:bg-zinc-800 rounded-md"></div>
      <div className="h-4 bg-emerald-100 dark:bg-zinc-800 rounded w-3/4"></div>
      <div className="h-3 bg-emerald-100 dark:bg-zinc-800 rounded w-1/2"></div>
    </div>
  );
}
