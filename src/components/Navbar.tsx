'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    checkUser();
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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🏪</span>
            <div>
              <div className="text-2xl font-bold text-green-600">
                Pasar Desa Digital
              </div>
              <div className="text-xs text-gray-500 hidden sm:block">
                Etalase UMKM Desa
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`font-medium transition ${
                isActive('/') 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/products"
              className={`font-medium transition ${
                isActive('/products') 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Produk
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="font-medium text-gray-700 hover:text-green-600 transition flex items-center gap-1">
                Kategori
                <span className="text-xs">▼</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/category/makanan" className="block px-4 py-2 hover:bg-green-50 hover:text-green-600">
                  🍔 Makanan
                </Link>
                <Link href="/category/minuman" className="block px-4 py-2 hover:bg-green-50 hover:text-green-600">
                  🥤 Minuman
                </Link>
                <Link href="/category/kerajinan" className="block px-4 py-2 hover:bg-green-50 hover:text-green-600">
                  🎨 Kerajinan
                </Link>
                <Link href="/category/pakaian" className="block px-4 py-2 hover:bg-green-50 hover:text-green-600">
                  👕 Pakaian
                </Link>
                <Link href="/category/pertanian" className="block px-4 py-2 hover:bg-green-50 hover:text-green-600">
                  🌾 Pertanian
                </Link>
                <Link href="/category/lainnya" className="block px-4 py-2 hover:bg-green-50 hover:text-green-600">
                  📦 Lainnya
                </Link>
              </div>
            </div>

            {/* User Menu or Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {profile?.store_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium text-gray-800">
                    {profile?.store_name || 'User'}
                  </span>
                  <span className="text-xs">▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md border">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-green-50 hover:text-green-600"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      href="/dashboard/products"
                      className="block px-4 py-2 hover:bg-green-50 hover:text-green-600"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      📦 Produk Saya
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 hover:bg-green-50 hover:text-green-600"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      👤 Profil Toko
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Daftar UMKM
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-green-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 rounded">
              Beranda
            </Link>
            <Link href="/products" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 rounded">
              Produk
            </Link>
            
            <div className="px-4 py-2 text-sm font-semibold text-gray-500">Kategori</div>
            <Link href="/category/makanan" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-8 rounded">
              🍔 Makanan
            </Link>
            <Link href="/category/minuman" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-8 rounded">
              🥤 Minuman
            </Link>
            <Link href="/category/kerajinan" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-8 rounded">
              🎨 Kerajinan
            </Link>
            <Link href="/category/pakaian" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-8 rounded">
              👕 Pakaian
            </Link>
            <Link href="/category/pertanian" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-8 rounded">
              🌾 Pertanian
            </Link>
            <Link href="/category/lainnya" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-8 rounded">
              📦 Lainnya
            </Link>

            <hr className="my-2" />

            {user ? (
              <>
                <div className="px-4 py-2 text-sm font-semibold text-gray-500">
                  {profile?.store_name || 'User'}
                </div>
                <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-8 rounded">
                  📊 Dashboard
                </Link>
                <Link href="/dashboard/products" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-8 rounded">
                  📦 Produk Saya
                </Link>
                <Link href="/dashboard/profile" className="block py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-8 rounded">
                  👤 Profil Toko
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-red-600 hover:bg-red-50 px-8 rounded"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-center bg-green-50 text-green-600 border border-green-600 rounded-lg mx-4">
                  Login
                </Link>
                <Link href="/register" className="block py-2 text-center bg-green-600 text-white rounded-lg mx-4">
                  Daftar UMKM
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}