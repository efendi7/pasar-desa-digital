'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'

export default function WaitingApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-6 py-12">
      
      {/* Kiri - Konten */}
      <div className="text-center lg:text-left max-w-md space-y-6">
        <div className="flex justify-center lg:justify-start">
          <div className="w-20 h-20 flex items-center justify-center bg-amber-100 rounded-full">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Menunggu Persetujuan Admin
        </h1>
        <p className="text-gray-600">
          Akun Anda telah berhasil didaftarkan dan email sudah diverifikasi. 
          Mohon tunggu persetujuan dari admin. Anda akan menerima email konfirmasi 
          setelah akun disetujui.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/bantuan"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Hubungi Admin
          </Link>
        </div>
      </div>

      {/* Kanan - Gambar */}
      <div className="relative w-full max-w-md mt-10 lg:mt-0 lg:ml-12 rounded-3xl overflow-hidden shadow-xl">
        <Image
          src="/images/waiting.png"
          alt="Menunggu Persetujuan"
          width={600}
          height={600}
          className="object-cover w-full h-full"
          priority
        />
      </div>

    </div>
  )
}
