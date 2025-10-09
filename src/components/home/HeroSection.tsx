"use client";

import { ShoppingCart, Store, Package, Eye, TrendingUp, TrendingDown } from "lucide-react";
import React, { useEffect } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef } from "react";

interface Stats {
  umkm: number;
  products: number;
  views: number;
  trend: number;
}

interface HeroSectionProps {
  stats: Stats;
}

const productImages = {
  food: "/images/makanan.webp",
  craft: "/images/kerajinan.jpeg",
  agriculture: "/images/pertanian.png",
  clothing: "/images/pakaian.webp",
};

// === Komponen Counter Animasi ===
const AnimatedCounter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString("id-ID"));
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, {
        duration: 1.8,
        ease: "easeOut",
      });
      return animation.stop;
    }
  }, [isInView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export const HeroSection = ({ stats }: HeroSectionProps) => {
  const statsData = [
    {
      icon: Store,
      value: stats.umkm,
      label: "UMKM Terdaftar",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Package,
      value: stats.products,
      label: "Produk Tersedia",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: Eye,
      value: stats.views,
      label: "Total Kunjungan",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Background pola lembut */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdHRlcm4gaWQ9Imc0MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjJjNTVlIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZzQwKSIvPjwvc3ZnPg==')] opacity-30" />

      {/* Glow */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* === KIRI === */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full text-sm font-medium text-green-700">
              <span>🌿</span> Platform UMKM Desa Terpercaya
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight font-made-tommy">
              Kebumify
            </h1>

            <p className="text-2xl font-semibold text-green-600">
              Etalase Digital UMKM Desa
            </p>

            <p className="text-lg text-gray-600 max-w-xl">
              Jembatan antara produk lokal berkualitas dengan pembeli modern.
              Promosikan produk UMKM Anda secara online dengan mudah dan gratis!
            </p>

            {/* Statistik */}
            <div className="flex flex-wrap gap-6">
              {statsData.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="group flex items-center gap-3"
                  >
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        <AnimatedCounter value={stat.value} />+
                      </div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tombol CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <AnimatedButton
                text="Jelajahi Produk"
                icon={ShoppingCart}
                href="/products"
                variant="primary"
              />
              <AnimatedButton
                text="Daftar Jadi Penjual"
                icon={Store}
                href="/register"
                variant="secondary"
              />
            </div>
          </div>

          {/* === KANAN === */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-yellow-100 rounded-3xl rotate-1 sm:rotate-2 md:rotate-3" />
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transform -rotate-3 sm:-rotate-2 md:-rotate-3 hover:rotate-0 active:rotate-0 transition-transform duration-500">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(productImages).map(([key, src]) => (
                  <div
                    key={key}
                    className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-4 shadow-md hover:shadow-lg active:shadow-inner transition-all duration-300 active:scale-95"
                  >
                    <div className="aspect-square rounded-xl mb-3 overflow-hidden">
                      <img
                        src={src}
                        alt={key}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 capitalize text-center">
                      {key}
                    </p>
                  </div>
                ))}
              </div>

             {/* Lencana floating dinamis */}
<div
  className={`absolute -top-5 -right-5 px-6 py-3 rounded-2xl shadow-xl transform rotate-3
  ${
    stats.trend > 0
      ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
      : stats.trend < 0
      ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
      : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
  }`}
>
  <div className="flex items-center gap-2">
    {/* Ganti ikon sesuai arah tren */}
    {stats.trend > 0 ? (
      <TrendingUp className="w-5 h-5" />
    ) : stats.trend < 0 ? (
      <TrendingDown className="w-5 h-5" />
    ) : (
      <TrendingUp className="w-5 h-5 opacity-60" />
    )}

    <div>
      <p className="text-xs font-medium">Trend Mingguan</p>
      <p className="text-lg font-bold">
        {stats.trend > 0
          ? `Naik ${stats.trend.toFixed(2)}%`
          : stats.trend < 0
          ? `Turun ${Math.abs(stats.trend).toFixed(2)}%`
          : "Stabil"}
      </p>
    </div>
  </div>
</div>


            </div>
          </div>
        </div>
      </div>

      {/* Wave bawah */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 140"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path d="M0,120 C480,40 960,200 1440,120 L1440,140 L0,140Z" />
        </svg>
      </div>
    </section>
  );
};
