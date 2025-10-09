'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
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
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

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

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-md h-20 flex items-center justify-center">
        <div className="text-lg font-semibold text-green-600">Kebumify</div>
      </nav>
    );
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-md"
            >
              <Store className="w-6 h-6" />
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-semibold">
                Kebumify
              </div>
              <div className="text-xs text-gray-500 font-medium tracking-wide">
                Etalase Digital UMKM Desa
              </div>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isActive('/')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Beranda
            </Link>

            <Link
              href="/products"
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isActive('/products')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Produk
            </Link>

            {/* Dropdown kategori dengan animasi */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition"
              >
                Kategori
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isCatOpen ? 'rotate-180 text-green-600' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isCatOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors"
                        >
                          <Icon className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-700">{cat.name}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

         {/* User Profile / Login */}
<div className="hidden lg:flex items-center gap-3">
  {user ? (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-green-300 bg-white hover:bg-green-50 transition"
      >
        {profile?.avatar_url ? (
  <img
    src={profile.avatar_url}
    alt="Avatar"
    className="w-8 h-8 rounded-full object-cover border border-green-200 shadow-sm"
    onError={(e) => (e.currentTarget.style.display = 'none')}
  />
) : (
  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold shadow-sm">
    {profile?.store_name?.charAt(0)?.toUpperCase() || 'U'}
  </div>
)}

        {/* Store name */}
        <span className="text-sm font-medium text-gray-800">
          {profile?.store_name || 'Toko Saya'}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isDropdownOpen ? 'rotate-180 text-green-600' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition"
            >
              <BarChart3 className="w-5 h-5 text-green-600" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition"
            >
              <Boxes className="w-5 h-5 text-green-600" />
              Produk Saya
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition"
            >
              <Settings className="w-5 h-5 text-green-600" />
              Pengaturan
            </Link>
            <div className="h-px bg-gray-100 my-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition"
      >
        Masuk
      </Link>
      <Link
        href="/register"
        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-sm transition"
      >
        Daftar Toko
      </Link>
    </div>
  )}
</div>


          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-gray-100 py-3 space-y-1"
            >
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive('/') ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive('/products') ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Produk
              </Link>

              <div className="pt-3 pb-1 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Kategori
              </div>

              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                  >
                    <Icon className="w-5 h-5 text-green-600" />
                    {cat.name}
                  </Link>
                );
              })}

              <div className="h-px bg-gray-100 my-3" />

              {user ? (
                <>
                  <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {profile?.store_name || 'Akun Saya'}
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/products"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Boxes className="w-5 h-5 text-green-600" />
                    Produk Saya
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 text-green-600" />
                    Pengaturan
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-5 h-5" />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition"
                  >
                    Daftar Toko
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
