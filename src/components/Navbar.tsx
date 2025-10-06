'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    
    // Scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
        .select('store_name')
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
    { name: 'Makanan', slug: 'makanan', icon: '🍽️' },
    { name: 'Minuman', slug: 'minuman', icon: '☕' },
    { name: 'Kerajinan', slug: 'kerajinan', icon: '🎨' },
    { name: 'Pakaian', slug: 'pakaian', icon: '👔' },
    { name: 'Pertanian', slug: 'pertanian', icon: '🌾' },
    { name: 'Lainnya', slug: 'lainnya', icon: '✨' },
  ];

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl shadow-md">
                  🏪
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-made-tommy">
                  Kebumify
                </div>
                <div className="text-xs text-gray-500 font-medium tracking-wide">
                  Etalase Digital UMKM Desa
                </div>
              </div>
            </Link>

            {/* Placeholder for menu button */}
            <div className="lg:hidden w-10 h-10" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Refined */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                🏪
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-made-tommy">
  Kebumify
</div>
<div className="text-xs text-gray-500 font-medium tracking-wide">
  Etalase Digital UMKM Desa
</div>
            </div>
          </Link>

          {/* Desktop Navigation - Minimalist */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/products') 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              Produk
            </Link>

            {/* Categories Dropdown - Elegant */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-all duration-200 flex items-center gap-1.5">
                Kategori
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu - Premium */}
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                <div className="py-2">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.slug}
                      href={`/category/${cat.slug}`} 
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors group/item"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover/item:text-green-600">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-green-100 border border-gray-200 hover:border-green-200 transition-all duration-200"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {profile?.store_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium text-gray-800 text-sm max-w-32 truncate">
                    {profile?.store_name || 'User'}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown - Premium Design */}
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="text-lg">📊</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                          Dashboard
                        </span>
                      </Link>
                      <Link
                        href="/dashboard/products"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="text-lg">📦</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                          Produk Saya
                        </span>
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="text-lg">⚙️</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                          Pengaturan
                        </span>
                      </Link>
                      <div className="h-px bg-gray-100 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors group"
                      >
                        <span className="text-lg">🚪</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                          Keluar
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Daftar Toko
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Refined */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1">
            <Link 
              href="/" 
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              href="/products" 
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/products') ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Produk
            </Link>
            
            <div className="pt-3 pb-1">
              <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Kategori
              </div>
            </div>
            
            {categories.map((cat) => (
              <Link 
                key={cat.slug}
                href={`/category/${cat.slug}`} 
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}

            <div className="h-px bg-gray-100 my-3" />

            {user ? (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {profile?.store_name || 'Akun Saya'}
                </div>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/dashboard/products" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>📦</span>
                  <span>Produk Saya</span>
                </Link>
                <Link 
                  href="/dashboard/profile" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>⚙️</span>
                  <span>Pengaturan</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span>🚪</span>
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link 
                  href="/login" 
                  className="block text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  className="block text-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Daftar Toko
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}