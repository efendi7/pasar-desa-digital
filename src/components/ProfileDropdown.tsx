import { RefObject } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Boxes,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react';

interface ProfileDropdownProps {
  user: any;
  profile: any;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
  isAdmin: boolean;
}

export default function ProfileDropdown({
  user,
  profile,
  isDropdownOpen,
  setIsDropdownOpen,
  handleLogout,
  dropdownRef,
  isAdmin,
}: ProfileDropdownProps) {
  return (
    <div className="hidden lg:flex items-center gap-3">
      {user ? (
        <div className="relative" ref={dropdownRef}>
          {/* === Dropdown Trigger === */}
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
                {profile?.store_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {profile?.store_name || 'Toko Saya'}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-300 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-green-600 dark:text-green-400' : ''
              }`}
            />
          </motion.button>

          {/* === Dropdown Menu === */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-56 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 
                           bg-white dark:bg-zinc-900 overflow-hidden backdrop-blur-sm"
              >
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 font-medium">
                    Toko Saya
                  </span>
                </Link>

                <Link
                  href="/dashboard/products"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <Boxes className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 font-medium">
                    Produk Saya
                  </span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <Settings className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 font-medium">
                    Edit Toko
                  </span>
                </Link>

                {isAdmin && (
                  <>
                    <div className="h-px bg-gray-100 dark:bg-zinc-700 my-1" />
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors group"
                    >
                      <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 font-medium">
                        Admin Panel
                      </span>
                    </Link>
                  </>
                )}

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
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg 
                       hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all"
          >
            Daftar Toko
          </Link>
        </div>
      )}
    </div>
  );
}
