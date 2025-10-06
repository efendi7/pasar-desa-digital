"use client";

import Link from "next/link";
import { UtensilsCrossed, Coffee, Palette, Shirt, Wheat, Package } from "lucide-react";
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
  makanan: UtensilsCrossed,
  minuman: Coffee,
  kerajinan: Palette,
  pakaian: Shirt,
  pertanian: Wheat,
  lainnya: Package,
};

export const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  return (
    <section className="py-16 space-y-8 relative overflow-hidden">
      {/* Background gradient blur effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 via-white to-green-100 opacity-60 blur-2xl" />

      <div className="text-center animate-fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Jelajahi Kategori
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Temukan produk UMKM terbaik berdasarkan kategori favorit Anda
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 px-4 sm:px-6 lg:px-8">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category.slug] || Package;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/category/${category.slug}`}
                className="group relative flex flex-col items-center justify-center bg-white/90 rounded-2xl p-6 shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 active:scale-95 focus:outline-none"
              >
                {/* Hover highlight circle */}
                <span className="absolute inset-0 bg-gradient-to-br from-green-100/0 via-green-100/0 to-green-200/0 rounded-2xl group-hover:from-green-100/40 group-hover:to-green-200/40 transition-all duration-500" />

                {/* Icon with animation */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative z-10 mb-3 p-4 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-300"
                >
                  <Icon className="h-7 w-7 text-green-600" />
                </motion.div>

                {/* Name */}
                <span className="relative z-10 font-medium text-gray-800 text-sm md:text-base group-hover:text-green-700 transition-colors duration-300">
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
