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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-green-300 bg-white hover:bg-green-50 transition-all shadow-sm hover:shadow"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-green-200 shadow-sm"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-700 font-semibold shadow-sm">
                {profile?.store_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <span className="text-sm font-medium text-gray-800">
              {profile?.store_name || 'Toko Saya'}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-green-600' : ''
              }`}
            />
          </motion.button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors group"
                >
                  <BarChart3 className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium">
                    Toko Saya
                  </span>
                </Link>
                <Link
                  href="/dashboard/products"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors group"
                >
                  <Boxes className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium">
                    Produk Saya
                  </span>
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors group"
                >
                  <Settings className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium">
                    Edit Toko
                  </span>
                </Link>
                {isAdmin && (
                  <>
                    <div className="h-px bg-gray-100 my-1" />
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors group"
                    >
                      <Shield className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-purple-700 group-hover:text-purple-800 font-medium">
                        Admin Panel
                      </span>
                    </Link>
                  </>
                )}
                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors group"
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
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all"
          >
            Daftar Toko
          </Link>
        </div>
      )}
    </div>
  );
}