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
  Sparkles
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

// ✅ Mapping sesuai dengan slug di database
const categoryIcons: Record<string, any> = {
  "makanan-minuman": UtensilsCrossed,
  "fashion": Shirt,
  "kerajinan": Palette,
  "pertanian": Wheat,
  "elektronik": Laptop,
  "lainnya": Package,
  "olahraga": Dumbbell,
  "kecantikan": Sparkles,
};

// ✅ Warna untuk setiap kategori (opsional, untuk variasi visual)
const categoryColors: Record<string, { bg: string; hover: string; text: string; icon: string }> = {
  "makanan-minuman": {
    bg: "bg-orange-50",
    hover: "group-hover:bg-orange-100",
    text: "group-hover:text-orange-700",
    icon: "text-orange-600"
  },
  "fashion": {
    bg: "bg-pink-50",
    hover: "group-hover:bg-pink-100",
    text: "group-hover:text-pink-700",
    icon: "text-pink-600"
  },
  "kerajinan": {
    bg: "bg-purple-50",
    hover: "group-hover:bg-purple-100",
    text: "group-hover:text-purple-700",
    icon: "text-purple-600"
  },
  "pertanian": {
    bg: "bg-green-50",
    hover: "group-hover:bg-green-100",
    text: "group-hover:text-green-700",
    icon: "text-green-600"
  },
  "elektronik": {
    bg: "bg-blue-50",
    hover: "group-hover:bg-blue-100",
    text: "group-hover:text-blue-700",
    icon: "text-blue-600"
  },
  "olahraga": {
    bg: "bg-red-50",
    hover: "group-hover:bg-red-100",
    text: "group-hover:text-red-700",
    icon: "text-red-600"
  },
  "kecantikan": {
    bg: "bg-rose-50",
    hover: "group-hover:bg-rose-100",
    text: "group-hover:text-rose-700",
    icon: "text-rose-600"
  },
  "lainnya": {
    bg: "bg-gray-50",
    hover: "group-hover:bg-gray-100",
    text: "group-hover:text-gray-700",
    icon: "text-gray-600"
  },
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
          // ✅ Ambil icon dan color berdasarkan slug
          const Icon = categoryIcons[category.slug] || Package;
          const colors = categoryColors[category.slug] || categoryColors["lainnya"];

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
                {/* Hover highlight circle - dengan warna dinamis */}
                <span className={`absolute inset-0 bg-gradient-to-br from-${category.slug === "makanan-minuman" ? "orange" : category.slug === "fashion" ? "pink" : "green"}-100/0 via-${category.slug === "makanan-minuman" ? "orange" : category.slug === "fashion" ? "pink" : "green"}-100/0 to-${category.slug === "makanan-minuman" ? "orange" : category.slug === "fashion" ? "pink" : "green"}-200/0 rounded-2xl group-hover:from-${category.slug === "makanan-minuman" ? "orange" : category.slug === "fashion" ? "pink" : "green"}-100/40 group-hover:to-${category.slug === "makanan-minuman" ? "orange" : category.slug === "fashion" ? "pink" : "green"}-200/40 transition-all duration-500`} />

                {/* Icon with animation dan warna sesuai kategori */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative z-10 mb-3 p-4 ${colors.bg} rounded-xl ${colors.hover} transition-colors duration-300`}
                >
                  <Icon className={`h-7 w-7 ${colors.icon}`} />
                </motion.div>

                {/* Name */}
                <span className={`relative z-10 font-medium text-gray-800 text-sm md:text-base ${colors.text} transition-colors duration-300`}>
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