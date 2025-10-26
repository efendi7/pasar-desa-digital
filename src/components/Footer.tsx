'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  // Footer untuk halaman admin (sederhana)
  if (isAdmin) {
    return (
      <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 py-6 text-center text-sm">
        <p>&copy; {currentYear} Pasar Desa Digital Admin Dashboard</p>
        <p className="text-gray-600 mt-1">
          Dikelola oleh Tim Pengembang Pasar Desa Digital
        </p>
      </footer>
    )
  }

  // Footer untuk halaman publik
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white mt-auto transition-colors">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <Logo variant="horizontal" inverted size="md" showSubtitle />
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
              {[
                { name: 'Beranda', href: '/' },
                { name: 'Katalog Produk', href: '/products' },
                { name: 'Daftar Jadi Penjual', href: '/register' },
                { name: 'Login UMKM', href: '/login' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 dark:text-green-300">
              Kategori
            </h4>
            <ul className="space-y-2 text-sm">
              {['makanan', 'minuman', 'kerajinan', 'pakaian', 'pertanian'].map((category) => (
                <li key={category}>
                  <Link
                    href={`/category/${category}`}
                    className="capitalize text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 dark:text-green-300">
              Kontak
            </h4>
            <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-500">
              <li className="flex items-center gap-2">
                <span>📧</span> <span>info@pasardesadigital.id</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span> <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> <span>Desa, Kecamatan, Kabupaten</span>
              </li>
            </ul>
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
  )
}
