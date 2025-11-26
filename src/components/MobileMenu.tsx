'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  LayoutDashboard,
  Boxes,
  LucidePencil,
  LogOut,
  Shield,
  Search,
  Users, // Import untuk Kelola Pengguna
  Package, // Alternatif untuk Kelola Produk (Admin)
} from 'lucide-react';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  user: any;
  profile: any;
  isAdmin?: boolean;
  handleLogout?: () => Promise<void>;
  toggleDarkMode?: () => void;
  isDarkMode?: boolean;
  isPublic?: boolean;
  isLoading?: boolean; // ✅ Tambahkan prop isLoading
}

// Data Menu untuk Pengguna UMKM Biasa
const UserMenuItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard Anda',
    color: 'green',
  },
  {
    href: '/dashboard/products',
    icon: Boxes,
    label: 'Produk Anda',
    color: 'green',
  },
  {
    href: '/dashboard/profile',
    icon: LucidePencil,
    label: 'Edit Profil Toko',
    color: 'green',
  },
];

// Data Menu untuk Admin
const AdminMenuItems = [
  {
    href: '/admin/dashboard',
    icon: Shield,
    label: 'Admin Dashboard',
    color: 'purple',
  },
  {
    href: '/admin/profiles',
    icon: Users,
    label: 'Kelola Pengguna',
    color: 'purple',
  },
  {
    href: '/admin/products',
    icon: Package,
    label: 'Kelola Produk',
    color: 'purple',
  },
];

export default function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
  user,
  profile,
  isAdmin = false, // Default ke false
  handleLogout,
  isLoading = false,
}: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [imageError, setImageError] = useState(false);
  const supabase = createClient();

  // Ambil data yang benar dari profile
  const fullName = profile?.full_name || 'User Tanpa Nama';
  const storeName = profile?.store_name || '-';
  const avatarUrl = profile?.avatar_url || '';
  const email = user?.email || '-';

  // Pilih set menu berdasarkan status Admin
  const activeMenuItems = useMemo(() => {
    if (isAdmin) {
      return AdminMenuItems;
    }
    return UserMenuItems;
  }, [isAdmin]);

  // Fungsi untuk mendapatkan inisial
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${searchQuery}%`)
        .limit(5);

      if (data && data.length > 0) {
        setSearchResults(data.map((p) => ({ ...p, isSuggestion: false })));
      } else {
        const { data: suggestion } = await supabase
          .from('products')
          .select('id, name')
          .ilike('name', `%${searchQuery.slice(0, 3)}%`)
          .limit(3);

        setSearchResults(
          suggestion && suggestion.length > 0
            ? suggestion.map((s) => ({ ...s, isSuggestion: true }))
            : [],
        );
      }
    };

    fetchProducts();
  }, [searchQuery, supabase]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  // Komponen Loader Profil Mobile (Skeleton)
  const MobileProfileLoader = () => (
    <div className="mb-5 text-center animate-pulse">
      <div className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 shadow-sm" />
      <div className="h-5 w-2/3 mx-auto bg-gray-200 dark:bg-zinc-700 rounded mb-1"></div>
      <div className="h-4 w-1/2 mx-auto bg-gray-200 dark:bg-zinc-700 rounded"></div>
      <div className="h-3 w-1/3 mx-auto bg-gray-200 dark:bg-zinc-700 rounded mt-1"></div>
    </div>
  );

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:hidden border-t border-gray-100 dark:border-zinc-800 overflow-hidden"
        >
          <div className="py-4 space-y-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 text-gray-800 dark:text-gray-200">
            
            {/* ===== PROFIL USER / LOADER ===== */}
            {isLoading ? (
              <MobileProfileLoader />
            ) : user && profile ? (
              <div className="mb-5 text-center">
                {avatarUrl && !imageError ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-green-200 dark:border-green-500 object-cover shadow-sm"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-full mx-auto mb-2 border-2 border-${isAdmin ? 'purple' : 'green'}-200 dark:border-${isAdmin ? 'purple' : 'green'}-500 bg-gradient-to-br from-${isAdmin ? 'purple' : 'green'}-400 to-${isAdmin ? 'purple' : 'green'}-600 dark:from-${isAdmin ? 'purple' : 'green'}-500 dark:to-${isAdmin ? 'purple' : 'green'}-700 flex items-center justify-center text-white font-bold text-xl shadow-sm`}>
                    {getInitials(storeName !== '-' ? storeName : fullName)}
                  </div>
                )}
                {/* store_name lebih besar dan tebal */}
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {isAdmin ? 'Admin' : storeName} 
                </div>
                {/* full_name lebih kecil dan ringan */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {fullName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {email}
                </div>
              </div>
            ) : (
                // Tampilkan ini hanya jika loading Selesai DAN user TIDAK ADA
                <div className="mb-5 text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Selamat Datang!
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Silakan masuk untuk mengelola toko Anda.
                    </div>
                </div>
            )}


            {/* ===== SEARCH BAR ===== */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute left-0 top-full mt-1 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg z-50">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className={`block px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 ${
                        p.isSuggestion
                          ? 'italic text-gray-500 dark:text-gray-400'
                          : ''
                      }`}
                      onClick={() => {
                        setSearchQuery('');
                        setIsMenuOpen(false);
                      }}
                    >
                      {p.isSuggestion
                        ? `Apakah yang kamu maksud: ${p.name}?`
                        : p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            
            <div className="h-px bg-gray-100 dark:bg-zinc-800 my-3" />

            {/* ===== MENU AKUN / LOGIN (DYNAMIC) ===== */}
            {!isLoading && user ? (
              <div>
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Menu {isAdmin ? 'Admin' : 'Akun'}
                </div>
                <div className="grid grid-cols-3 gap-2"> {/* ✅ Ubah grid-cols-2 menjadi grid-cols-3 untuk menampung 3 menu admin/user */}
                  
                  {activeMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border border-${item.color}-100 dark:border-${item.color}-900 hover:border-${item.color}-300 dark:hover:border-${item.color}-500 hover:bg-${item.color}-50 dark:hover:bg-${item.color}-900/20 transition-all group`}
                      >
                        <Icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400 group-hover:scale-110 transition-transform`} />
                        <span className={`text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-${item.color}-700 dark:group-hover:text-${item.color}-400 text-center`}>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                  
                  {/* Tombol Keluar (Selalu ada) */}
                  <button
                    onClick={handleLogout}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-red-100 dark:border-red-900 hover:border-red-300 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all group"
                  >
                    <LogOut className="w-6 h-6 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-red-600 dark:text-red-400 text-center">
                      Keluar
                    </span>
                  </button>
                </div>
              </div>
            ) : !isLoading && !user ? (
              // Tampilkan Login/Daftar hanya jika loading Selesai DAN user TIDAK ADA
              <div className="space-y-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center px-4 py-3 text-sm font-medium border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 dark:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all"
                >
                  Daftar Toko
                </Link>
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}