'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import {
  Store,
  Package,
  Eye,
  TrendingUp,
  TrendingDown,
  LogOut,
  PlusCircle,
  UserCircle2,
  Menu,
} from 'lucide-react';
import { ProductCard } from "@/components/ui/ProductCard";

// === Animated Counter ===
const AnimatedCounter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString('id-ID'));
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, { duration: 1.5, ease: 'easeOut' });
      return animation.stop;
    }
  }, [isInView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

interface DashboardClientProps {
  initialProfile: any;
  initialProducts: any[];
}

export default function DashboardClient({
  initialProfile,
  initialProducts,
}: DashboardClientProps) {
  const [profile] = useState(initialProfile);
  const [products] = useState(initialProducts);
  const [isMobile, setIsMobile] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const statsData = [
    {
      icon: Package,
      value: products.length,
      label: 'Total Produk',
      color: 'from-emerald-400 to-green-500',
    },
    {
      icon: Store,
      value: products.filter((p) => p.is_active).length,
      label: 'Produk Aktif',
      color: 'from-sky-400 to-blue-500',
    },
    {
      icon: Eye,
      value: products.reduce((sum, p) => sum + (p.views || 0), 0),
      label: 'Total Views',
      color: 'from-purple-400 to-indigo-500',
      trend: 12,
    },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-12">
      {/* Background glow */}
      <div className="fixed -top-40 -left-40 w-[20rem] md:w-[30rem] h-[20rem] md:h-[30rem] bg-emerald-200 rounded-full blur-3xl opacity-25 pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-[20rem] md:w-[30rem] h-[20rem] md:h-[30rem] bg-indigo-200 rounded-full blur-3xl opacity-25 pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-10"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-2 sm:gap-3">
              <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
              <span className="truncate">Dashboard {profile?.store_name}</span>
            </h1>
            <p className="text-green-600 mt-1 text-sm sm:text-base font-medium">
              Selamat datang, {profile?.full_name}
            </p>
          </div>

          {/* Desktop buttons */}
          {!isMobile && (
            <div className="flex gap-3">
              <Link
                href="/dashboard/products/add"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <PlusCircle className="w-5 h-5" />
                Tambah Produk
              </Link>
              <Link
                href="/dashboard/products"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                <Package className="w-5 h-5" />
                Kelola Produk
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
              >
                <UserCircle2 className="w-5 h-5" />
                Profil
              </Link>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 border border-red-600 rounded-xl hover:bg-red-50 transition"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats - NO HORIZONTAL SCROLL */}
      <div className="mb-8 sm:mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const trend = stat.trend ?? 0;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center w-full"
              >
                <div className="flex items-center justify-center mb-3 sm:mb-4 relative w-full">
                  <div
                    className={`bg-gradient-to-br ${stat.color} p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-md`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  {trend !== 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className={`absolute right-0 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        trend > 0
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {trend > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {trend > 0 ? `+${trend}%` : `${trend}%`}
                    </motion.div>
                  )}
                </div>

                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>

                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-2xl opacity-0 hover:opacity-100 transition-opacity duration-300`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button (MOBILE ONLY) */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFabOpen(!isFabOpen)}
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          {isFabOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-16 right-0 bg-white/90 backdrop-blur-lg border border-gray-100 rounded-xl shadow-xl p-2 flex flex-col gap-2 w-48"
            >
              <Link
                href="/dashboard/products/add"
                className="flex items-center gap-2 px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg"
                onClick={() => setIsFabOpen(false)}
              >
                <PlusCircle className="w-5 h-5" />
                <span className="font-medium text-sm">Tambah Produk</span>
              </Link>
              <Link
                href="/dashboard/products"
                className="flex items-center gap-2 px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsFabOpen(false)}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium text-sm">Kelola Produk</span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-lg"
                onClick={() => setIsFabOpen(false)}
              >
                <UserCircle2 className="w-5 h-5" />
                <span className="font-medium text-sm">Edit Profil</span>
              </Link>
            </motion.div>
          )}
        </div>
      )}

      {/* Produk Terbaru */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg border border-gray-100 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8"
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produk Terbaru</h2>
          <Link
            href="/dashboard/products"
            className="text-green-600 hover:underline text-xs sm:text-sm font-medium"
          >
            Lihat Semua →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-gray-500">
            <p className="text-base sm:text-lg mb-4">Belum ada produk</p>
            <Link
              href="/dashboard/products/add"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-98 transition text-sm sm:text-base"
            >
              <PlusCircle className="w-5 h-5" /> Tambah Produk Pertama
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.slice(0, 3).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                showEdit
                profileName={profile?.store_name}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
