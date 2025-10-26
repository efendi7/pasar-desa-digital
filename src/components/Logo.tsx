'use client'

import Image from 'next/image'

interface LogoProps {
  variant?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
  className?: string
  inverted?: boolean
}

export default function Logo({
  variant = 'vertical',
  size = 'md',
  showSubtitle = true,
  className = '',
  inverted = false,
}: LogoProps) {
  const sizes = {
    sm: {
      img: 32, // px (2rem)
      title: 'text-lg',
      subtitle: 'text-[10px]',
      gap: 'gap-2',
    },
    md: {
      img: 48, // px (3rem)
      title: 'text-2xl',
      subtitle: 'text-xs',
      gap: 'gap-3',
    },
    lg: {
      img: 64, // px (4rem)
      title: 'text-3xl',
      subtitle: 'text-sm',
      gap: 'gap-4',
    },
  }

  const currentSize = sizes[size]
  const titleColor = inverted ? 'text-white' : 'text-gray-900 dark:text-white'
  const subtitleColor = inverted ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'

  // --- Horizontal (untuk navbar, footer, dsb)
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center ${currentSize.gap} ${className}`}>
        <Image
          src="/images/logoweb.png"
          alt="Logo Kebumify"
          width={currentSize.img}
          height={currentSize.img}
          className="rounded-lg object-contain"
          priority
        />
        <div className="flex flex-col">
          <span className={`${currentSize.title} font-bold ${titleColor}`}>
            Kebumify
          </span>
          {showSubtitle && (
            <span className={`${currentSize.subtitle} ${subtitleColor}`}>
              Etalase Digital UMKM Desa
            </span>
          )}
        </div>
      </div>
    )
  }

  // --- Vertical (untuk halaman auth, landing page)
  return (
    <div className={`text-center ${className}`}>
      <div className="flex justify-center mb-3">
        <Image
          src="/images/logoweb.png"
          alt="Logo Kebumify"
          width={currentSize.img * 1.5}
          height={currentSize.img * 1.5}
          className="rounded-2xl object-contain"
          priority
        />
      </div>
      <h1 className={`${currentSize.title} font-bold ${titleColor}`}>Kebumify</h1>
      {showSubtitle && (
        <p className={`${currentSize.subtitle} ${subtitleColor} mt-2`}>
          Etalase Digital UMKM Desa
        </p>
      )}
    </div>
  )
}
