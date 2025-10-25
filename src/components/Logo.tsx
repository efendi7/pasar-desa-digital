// Logo.tsx - PERBAIKAN: Hapus Link dari dalam component
// Component ini HANYA menampilkan logo, tanpa wrapping Link
// Link akan ditambahkan oleh parent component yang menggunakannya

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Icon/Image Logo */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg sm:text-xl">S</span>
      </div>
      
      {/* Text Logo */}
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
          StoreHub
        </span>
        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-tight">
          Admin Dashboard
        </span>
      </div>
    </div>
  )
}