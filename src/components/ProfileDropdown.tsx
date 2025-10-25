'use client'

import { RefObject } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, ChevronDown } from 'lucide-react'

interface ProfileDropdownProps {
  user: any
  profile: any
  isDropdownOpen: boolean
  setIsDropdownOpen: (isOpen: boolean) => void
  handleLogout: () => void
  dropdownRef: RefObject<HTMLDivElement | null>
}

export default function ProfileDropdown({
  user,
  profile,
  isDropdownOpen,
  setIsDropdownOpen,
  handleLogout,
  dropdownRef,
}: ProfileDropdownProps) {
  const storeName = profile?.store_name || 'Toko'
  const fullName = profile?.full_name || 'Pengguna'

  return (
    <div className="hidden lg:flex items-center gap-3">
      {user ? (
        <div className="relative" ref={dropdownRef}>
          {/* === Trigger === */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 
                       bg-white dark:bg-zinc-800 hover:border-green-300 dark:hover:border-green-500 
                       hover:bg-green-50 dark:hover:bg-zinc-700 transition-all shadow-sm hover:shadow"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-green-200 dark:border-green-500 shadow-sm"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 
                              dark:from-green-700 dark:to-green-600 flex items-center justify-center 
                              text-green-700 dark:text-white font-semibold shadow-sm">
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {storeName}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-300 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-green-600 dark:text-green-400' : ''
              }`}
            />
          </motion.button>

          {/* === Dropdown === */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-64 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 
                           bg-white dark:bg-zinc-900 overflow-hidden backdrop-blur-sm"
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || 'email@domain.com'}
                  </p>
                </div>

                <div className="h-px bg-gray-100 dark:bg-zinc-700 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 
                             hover:bg-red-50 dark:hover:bg-red-950 transition-colors group"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Keluar Akun</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <a
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            Masuk
          </a>
          <a
            href="/register"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg 
                       hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all"
          >
            Daftar
          </a>
        </div>
      )}
    </div>
  )
}