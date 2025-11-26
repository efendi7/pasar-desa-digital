import Link from "next/link";
import Logo from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <Link href="/" className="block mb-8">
          <Logo variant="vertical" size="md" />
        </Link>

        {/* Auth Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Additional Info */}
        <p className="mt-4 text-center text-xs text-gray-500">
          © 2025 Kebumify. Etalase Digital UMKM Desa Kebumen.
        </p>
      </div>
    </div>
  );
}