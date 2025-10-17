"use client";

import { Rocket, ShoppingBag, Sparkles } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

export const CTASection = () => {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-white mt-24"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none" />

      {/* Soft blurred orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-green-200/40 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-yellow-100/40 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1.2s" }}
      />

      {/* Content */}
      <div className="relative container mx-auto px-6 py-20 md:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/70 rounded-full text-sm font-medium text-green-700 border border-green-200 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-green-600 animate-spin-slow" />
            <span>Bergabunglah dengan Komunitas UMKM</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Siap Bergabung dengan Kami?
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Ribuan pembeli menunggu produk Anda. Daftar sekarang dan mulai
            berjualan online tanpa biaya apapun!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <AnimatedButton
              text="Daftar Gratis Sekarang"
              icon={Rocket}
              href="/register"
              variant="primary"
            />
            <AnimatedButton
              text="Belanja Sekarang"
              icon={ShoppingBag}
              href="/products"
              variant="secondary"
            />
          </div>

          {/* Feature points */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-gray-700 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span>100% Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span>Mudah Digunakan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <span>Transaksi Langsung via WhatsApp</span>
            </div>
          </div>
        </div>
      </div>

      {/* === Wave bawah blend halus === */}
      <div className="absolute bottom-[-1px] left-0 right-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-[140px] md:h-[160px]"
        >
          <defs>
            <linearGradient id="ctaWaveGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="#f0fdf4" /> {/* Tailwind green-50 */}
            </linearGradient>
          </defs>
          <path
            fill="url(#ctaWaveGradient)"
            d="M0,96L60,101.3C120,107,240,117,360,106.7C480,96,600,64,720,53.3C840,43,960,53,1080,69.3C1200,85,1320,107,1380,117.3L1440,128V0H1380C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0H0Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};
