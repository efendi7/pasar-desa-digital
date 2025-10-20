"use client";

import Link from "next/link";
import {
  UtensilsCrossed,
  Shirt,
  Palette,
  Wheat,
  Laptop,
  Package,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

const categoryIcons: Record<string, any> = {
  "makanan-minuman": UtensilsCrossed,
  fashion: Shirt,
  kerajinan: Palette,
  pertanian: Wheat,
  elektronik: Laptop,
  olahraga: Dumbbell,
  kecantikan: Sparkles,
  lainnya: Package,
};

// --- PERUBAHAN DI SINI ---
// Menambahkan kelas dark mode untuk background, teks, dan hover
const categoryColors: Record<string, string> = {
  "makanan-minuman":
    "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/50 dark:text-orange-400 dark:hover:bg-orange-900/80",
  fashion:
    "bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-900/50 dark:text-pink-400 dark:hover:bg-pink-900/80",
  kerajinan:
    "bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/50 dark:text-purple-400 dark:hover:bg-purple-900/80",
  pertanian:
    "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-400 dark:hover:bg-green-900/80",
  elektronik:
    "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/80",
  olahraga:
    "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900/80",
  kecantikan:
    "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-900/80",
  lainnya:
    "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-900/80",
};

export const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  return (
    // Menggunakan bg-white/dark:bg-zinc-950 sebagai fallback
    <section className="py-14 relative overflow-hidden bg-white dark:bg-zinc-950">
      {/* --- PERUBAHAN DI SINI --- */}
      {/* Menambahkan gradient untuk dark mode */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 via-white to-green-100 opacity-70 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 dark:opacity-100" />

      <div className="text-center mb-10">
        {/* text-foreground sudah adaptif */}
        <h2 className="text-3xl font-bold text-foreground">Jelajahi Kategori</h2>
        {/* text-muted-foreground sudah adaptif */}
        <p className="text-muted-foreground mt-2 text-lg">
          Temukan produk UMKM terbaik di berbagai kategori
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category.slug] || Package;
          const colorClass =
            categoryColors[category.slug] || categoryColors["lainnya"];

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/category/${category.slug}`}
                // --- PERUBAHAN DI SINI ---
                // Menambahkan dark:bg-zinc-900 dan dark:border-zinc-800
                // Mengganti border-gray-100 -> border-zinc-100
                className={`group flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-sm hover:shadow-md border border-zinc-100 dark:border-zinc-800 transition-all duration-200 active:scale-95 min-h-[160px]`}
              >
                <div
                  className={`mb-3 p-4 rounded-xl ${colorClass} transition-all duration-300`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                {/* Pakai line clamp agar teks panjang tetap rapi */}
                {/* --- PERUBAHAN DI SINI --- */}
                {/* Mengganti text-gray-800 -> text-zinc-800 dark:text-zinc-200 */}
                <span className="font-medium text-zinc-800 dark:text-zinc-200 text-sm md:text-base group-hover:text-foreground transition-colors leading-tight line-clamp-2">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};