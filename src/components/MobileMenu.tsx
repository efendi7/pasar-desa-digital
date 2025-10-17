import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  UtensilsCrossed,
  Coffee,
  Palette,
  Shirt,
  Wheat,
  Package,
  BarChart3,
  Boxes,
  Settings,
  LogOut,
  Shield,
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
  );
}