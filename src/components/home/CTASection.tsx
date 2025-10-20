"use client";

import { Rocket, ShoppingBag, Sparkles } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

export const CTASection = () => {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 mt-24"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 dark:opacity-10 pointer-events-none" />

      {/* Soft blurred orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-green-200/40 dark:bg-green-800/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-yellow-100/40 dark:bg-yellow-800/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1.2s" }}
      />

      {/* Content */}
      <div className="relative container mx-auto px-6 py-20 md:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/70 dark:bg-green-900/50 rounded-full text-sm font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400 animate-spin-slow" />
            <span>Bergabunglah dengan Komunitas UMKM</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
            Siap Bergabung dengan Kami?
          </h2>

          {/* Paragraph */}
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
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
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-zinc-700 dark:text-zinc-400 text-sm">
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

      {/* === Wave bawah dihapus === */}
      {/* <div className="absolute bottom-[-1px] left-0 right-0 w-full overflow-hidden leading-none">
        ... SVG ...
      </div> 
      */}
    </section>
  );
};