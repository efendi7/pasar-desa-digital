import { Suspense } from 'react'
import RegisterContent from './RegisterContent'

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterContent />
    </Suspense>
  )
}

// Loading skeleton
function RegisterSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-100 dark:border-zinc-800">
      
      {/* Header Skeleton */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-zinc-800">
        <div className="animate-pulse space-y-3">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="p-8 space-y-5 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}

        <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  )
}