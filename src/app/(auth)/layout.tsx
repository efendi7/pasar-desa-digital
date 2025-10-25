import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Logo/Branding */}
      <Link href="/" className="mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-700">Pasar Desa Digital</h1>
          <p className="text-sm text-gray-600 mt-1">Etalase Digital UMKM Desa</p>
        </div>
      </Link>

      {/* Auth Form Container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {children}
      </div>

      {/* Footer Link */}
      <p className="mt-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-green-600 transition">
          ← Kembali ke Beranda
        </Link>
      </p>
    </div>
  );
}