import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white mt-auto transition-colors">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🏪</span>
              <h3 className="text-xl font-bold text-white dark:text-green-400">Pasar Desa Digital</h3>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Platform etalase digital untuk memberdayakan UMKM desa agar dapat memasarkan produknya secara online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 dark:text-green-300">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition">
                  Daftar Jadi Penjual
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition">
                  Login UMKM
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 dark:text-green-300">Kategori</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/makanan" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition">
                  Makanan
                </Link>
              </li>
              <li>
                <Link href="/category/minuman" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition">
                  Minuman
                </Link>
              </li>
              <li>
                <Link href="/category/kerajinan" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition">
                  Kerajinan
                </Link>
              </li>
              <li>
                <Link href="/category/pakaian" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition">
                  Pakaian
                </Link>
              </li>
              <li>
                <Link href="/category/pertanian" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition">
                  Pertanian
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h4 className="font-semibold mb-4 text-green-400 dark:text-green-300">Kontak</h4>
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
              <p className="text-xs text-gray-500 dark:text-gray-600 mb-2">Ikuti Kami:</p>
              <div className="flex gap-3">
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-green-400 transition" aria-label="WhatsApp">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
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