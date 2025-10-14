'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import {
  UtensilsCrossed,
  Coffee,
  Palette,
  Shirt,
  Wheat,
  Package,
  LogOut,
  Settings,
  BarChart3,
  Boxes,
  Menu,
  X,
  Store,
  ChevronDown,
  User,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsCatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('store_name, avatar_url')
        .eq('id', user.id)
        .single();
      setProfile(profileData);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = '/';
  }

  const isActive = (path: string) => pathname === path;

  const categories = [
    { name: 'Makanan', slug: 'makanan', icon: UtensilsCrossed },
    { name: 'Minuman', slug: 'minuman', icon: Coffee },
    { name: 'Kerajinan', slug: 'kerajinan', icon: Palette },
    { name: 'Pakaian', slug: 'pakaian', icon: Shirt },
    { name: 'Pertanian', slug: 'pertanian', icon: Wheat },
    { name: 'Lainnya', slug: 'lainnya', icon: Package },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg'
          : 'bg-white/80 backdrop-blur-2xl shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-md"
            >
              <Store className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-semibold">
                Kebumify
              </div>
              <div className="text-xs text-gray-500 font-medium tracking-wide">
                Etalase Digital UMKM Desa
              </div>
            </div>
            <div className="sm:hidden">
              <div className="text-lg bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-semibold">
                Kebumify
              </div>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/products"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/products')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Produk
            </Link>

            {/* Dropdown kategori */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                Kategori
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCatOpen ? 'rotate-180 text-green-600' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isCatOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={() => setIsCatOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors group"
                        >
                          <Icon className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                          <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium">
                            {cat.name}
                          </span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Link - Desktop */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname?.startsWith('/admin')
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop Profile / Auth */}
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
                      
                      {/* Admin Link in Dropdown */}
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

          {/* Mobile: Avatar/Auth + Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <Link href="/dashboard/profile" className="flex items-center gap-2">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-green-200 shadow-sm"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-700 font-semibold text-xs shadow-sm">
                    {profile?.store_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-800 max-w-[80px] truncate">
                  {profile?.store_name || 'Toko'}
                </span>
              </Link>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-gray-100 overflow-hidden"
            >
              <div className="py-4 space-y-1 bg-white/95 backdrop-blur-md">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Beranda
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/products')
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Produk
                </Link>

                <div className="pt-4 pb-2 px-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Kategori
                  </div>
                  
                  {/* Grid Layout untuk Kategori - 2 Kolom */}
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group"
                        >
                          <Icon className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 text-center">
                            {cat.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-3" />

                {user ? (
                  <div className="px-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Menu Akun
                    </div>
                    {/* Grid 2 Kolom untuk Menu Dashboard */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group"
                      >
                        <BarChart3 className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 text-center">
                          Dashboard
                        </span>
                      </Link>
                      
                      <Link
                        href="/dashboard/products"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group"
                      >
                        <Boxes className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 text-center">
                          Produk Saya
                        </span>
                      </Link>
                      
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group"
                      >
                        <Settings className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 text-center">
                          Pengaturan
                        </span>
                      </Link>
                      
                      {/* Admin Link - Mobile */}
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg border border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                        >
                          <Shield className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-purple-600 text-center">
                            Admin Panel
                          </span>
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg border border-red-100 hover:border-red-300 hover:bg-red-50 transition-all group"
                      >
                        <LogOut className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-red-600 text-center">
                          Keluar
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 px-4 pt-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center px-4 py-3 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md transition-all"
                    >
                      Daftar Toko
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}