'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Deteksi apakah sedang di halaman admin
  const isAdmin = pathname.startsWith('/admin');

  // Tampilan khusus untuk halaman admin (lebih simpel)
  if (isAdmin) {
    return (
      <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 py-6 text-center text-sm">
        <p>&copy; {currentYear} Pasar Desa Digital Admin Dashboard</p>
        <p className="text-gray-600 mt-1">
          Dikelola oleh Tim Pengembang Pasar Desa Digital
        </p>
      </footer>
    );
  }

  // Footer umum untuk halaman publik
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white mt-auto transition-colors">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🏪</span>
              <h3 className="text-xl font-bold text-white dark:text-green-400">
                Pasar Desa Digital
              </h3>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Platform etalase digital untuk memberdayakan UMKM desa agar dapat
              memasarkan produknya secara online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 dark:text-green-300">
              Menu
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition"
                >
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition"
                >
                  Daftar Jadi Penjual
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition"
                >
                  Login UMKM
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 dark:text-green-300">
              Kategori
            </h4>
            <ul className="space-y-2 text-sm">
              {['makanan', 'minuman', 'kerajinan', 'pakaian', 'pertanian'].map(
                (category) => (
                  <li key={category}>
                    <Link
                      href={`/category/${category}`}
                      className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition capitalize"
                    >
                      {category}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 dark:text-green-300">
              Kontak
            </h4>
            <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span>info@pasardesadigital.id</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span>
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Desa, Kecamatan, Kabupaten</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-600 mb-2">
                Ikuti Kami:
              </p>
              <div className="flex gap-3">
                {[
                  {
                    name: 'Facebook',
                    href: '#',
                    svg: (
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    ),
                  },
                  {
                    name: 'Instagram',
                    href: '#',
                    svg: (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07..." />
                    ),
                  },
                  {
                    name: 'WhatsApp',
                    href: '#',
                    svg: (
                      <path d="M.057 24l1.687-6.163c-1.041..." />
                    ),
                  },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {item.svg}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400 dark:text-gray-600">
          <p>&copy; {currentYear} Pasar Desa Digital. All rights reserved.</p>
          <p className="mt-1">
            Dikembangkan dengan ❤️ oleh Mahasiswa KKN untuk pemberdayaan UMKM Desa
          </p>
        </div>
      </div>
    </footer>
  );
}
