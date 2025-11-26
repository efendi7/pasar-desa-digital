'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import { Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const supabase = createClient();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Ambil user setelah halaman render
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="font-bold text-xl text-green-700 dark:text-green-400">
          Kebumify
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`hover:text-green-600 dark:hover:text-green-400 ${
              pathname === '/' ? 'text-green-600 font-medium' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Home
          </Link>

          <Link
            href="/produk"
            className={`hover:text-green-600 dark:hover:text-green-400 ${
              pathname === '/produk'
                ? 'text-green-600 font-medium'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Produk
          </Link>

          {/* User Login State */}
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-600"
              >
                <User size={18} />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-500 font-medium hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 font-medium"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 dark:text-gray-300"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 px-4 py-3 space-y-3">
          <Link href="/" className="block py-1 text-gray-800 dark:text-gray-200">
            Home
          </Link>
          <Link href="/produk" className="block py-1 text-gray-800 dark:text-gray-200">
            Produk
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="block py-1 text-gray-800 dark:text-gray-200">
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-500 font-semibold px-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-1 text-gray-800 dark:text-gray-200">
                Login
              </Link>
              <Link
                href="/register"
                className="block py-1 text-green-600 dark:text-green-400 font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
