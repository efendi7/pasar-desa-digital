import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  BarChart3,
  Boxes,
  Settings,
  LogOut,
  Shield,
  Search,
} from 'lucide-react';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  user: any;
  profile: any;
  isAdmin: boolean;
  handleLogout: () => void;
}

export default function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
  user,
  profile,
  isAdmin,
  handleLogout,
}: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const supabase = createClient();

  // Live search untuk mobile
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
            : []
        );
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:hidden border-t border-gray-100 overflow-hidden"
        >
          <div className="py-4 space-y-1 bg-white/95 backdrop-blur-md px-4">
            {/* ===== SEARCH BAR ===== */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className={`block px-3 py-2 text-sm hover:bg-gray-50 ${
                        p.isSuggestion ? 'italic text-gray-500' : ''
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

            {/* ===== NAV LINKS ===== */}
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive('/products') ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Produk
            </Link>

            <div className="h-px bg-gray-100 my-3" />

            {user ? (
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Menu Akun
                </div>
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
              <div className="space-y-2 pt-2">
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
  );
}
