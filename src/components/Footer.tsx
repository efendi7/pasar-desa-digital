'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'
import {
  Instagram,
  Youtube,
  Github,
  Mail,
  MapPin,
  Send,
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  // Koordinat Lokasi
  const MAP_COORDINATES = '-7.3625376888649585,110.26732553414672'
  
  // Link Google Maps langsung buka aplikasi/browser
  const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=$?q=${MAP_COORDINATES}`
  
  // URL untuk iframe embed peta
  const IFRAME_SRC = `https://maps.google.com/maps?q=${MAP_COORDINATES}&output=embed&z=15`

  // Nomor WhatsApp (contoh, ganti dengan nomor sebenarnya)
  const WHATSAPP_NUMBER = '6281234567890' 
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Halo%2C%20saya%20tertarik%20dengan%20Kebumify.`

  // Footer halaman admin
  if (isAdmin) {
    return (
      <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 py-6 text-center text-sm">
        <p>© {currentYear} Kebumify Admin Dashboard</p>
        <p className="text-gray-600 mt-1">
          Dikelola oleh Tim Developer Kebumify
        </p>
      </footer>
    )
  }

  // Footer publik (Dark Green Minimalist)
  return (
    <footer className="bg-[#102A2A] text-white mt-auto transition-colors border-t border-[#1a3838]">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Kolom 1: Logo & Ringkasan */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo variant="horizontal" inverted size="md" showSubtitle />
            </div>
            <p className="text-gray-300 text-sm">
              Etalase digital UMKM Desa Kebumen.
            </p>
          </div>

          {/* Kolom 2: Menu Utama */}
          <div>
            <h4 className="font-semibold mb-3 text-green-400">Menu</h4>
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
                    className="text-gray-300 hover:text-green-300 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak Cepat & Map */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-3 text-green-400">Kontak & Lokasi</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {/* Email */}
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-300" />
                <span>kebumify@gmail.com</span>
              </li>

              {/* Link Maps Langsung */}
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-300" />
                <Link
                  href={MAPS_LINK}
                  target="_blank"
                  className="hover:text-green-300 underline"
                  rel="noopener noreferrer" 
                >
                  Lihat Lokasi Tepat di Google Maps
                </Link>
              </li>
              
              {/* Tombol WhatsApp */}
              <li className="pt-2">
                <Link
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition text-xs"
                >
                  <Send className="w-4 h-4" />
                  Chat via WhatsApp
                </Link>
              </li>
            </ul>

            {/* MAPS EMBED MINI */}
            <div className="mt-4 rounded-xl overflow-hidden border border-[#1a3838]">
              <iframe
                src={IFRAME_SRC}
                width="100%"
                height="150"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Lokasi Kantor Desa Kebumen di Google Maps"
              ></iframe>
            </div>
          </div>


          {/* Kolom 4: Media Sosial */}
          <div>
            <h4 className="font-semibold mb-3 text-green-400">Ikuti Kami</h4>
            <div className="flex space-x-4">
              {/* Instagram */}
              <Link 
                href="https://instagram.com/pemdeskebumen_pringsurat" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition"
                aria-label="Instagram Kebumify"
              >
                <Instagram className="w-6 h-6" />
              </Link>
              
              {/* YouTube */}
              <Link 
                href="https://youtube.com/@DESAKEBUMENTEMANGGUNG" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-500 transition"
                aria-label="Youtube Desa Kebumen"
              >
                <Youtube className="w-6 h-6" />
              </Link>

              {/* GitHub */}
              <Link
                href="https://github.com/efendi7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gray-400 transition"
                aria-label="GitHub Developer"
              >
                <Github className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR - Hak Cipta & Developer */}
        <div className="border-t border-[#1a3838] mt-10 pt-6 text-center text-sm text-gray-400">
          <p>© {currentYear} Kebumify. All rights reserved.</p>

          <p className="mt-1">
            Developed by{' '}
            <span className="text-green-300 font-semibold">
              Muhammad Ma'mun Efendi – Teknik Informatika UNNES '22
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}