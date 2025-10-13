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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* === CARD WRAPPER mirip Edit Profile === */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* === Header mirip edit profile === */}
        <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-8 py-6 border-b border-green-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Store className="w-7 h-7 text-green-600" />
                Dashboard {profile?.store_name}
              </h1>
              <p className="text-gray-600 mt-1">Selamat datang, {profile?.full_name}</p>
            </div>

            {!isMobile && (
              <div className="flex flex-wrap gap-3">
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
                  className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* === BODY === */}
        <div className="p-8 space-y-10">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              const trend = stat.trend ?? 0;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
                >
                  <div
                    className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-sm mb-3`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <p className="text-3xl font-extrabold text-gray-900 mb-1">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>

                  {trend !== 0 && (
                    <div
                      className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-semibold ${
                        trend > 0
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {trend > 0 ? (
                        <TrendingUp className="inline w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="inline w-3 h-3 mr-1" />
                      )}
                      {trend > 0 ? `+${trend}%` : `${trend}%`}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Produk Terbaru */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Produk Terbaru</h2>
              <Link
                href="/dashboard/products"
                className="text-green-600 hover:underline text-sm font-medium"
              >
                Lihat Semua →
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-4">Belum ada produk</p>
                <Link
                  href="/dashboard/products/add"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                  <PlusCircle className="w-5 h-5" /> Tambah Produk Pertama
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
      </div>

      {/* Floating Action Button (MOBILE) */}
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
              className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-xl shadow-xl p-2 flex flex-col gap-2 w-48"
            >
              <Link
                href="/dashboard/products/add"
                className="flex items-center gap-2 px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg"
                onClick={() => setIsFabOpen(false)}
              >
                <PlusCircle className="w-5 h-5" />
                Tambah Produk
              </Link>
              <Link
                href="/dashboard/products"
                className="flex items-center gap-2 px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsFabOpen(false)}
              >
                <Package className="w-5 h-5" />
                Kelola Produk
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-lg"
                onClick={() => setIsFabOpen(false)}
              >
                <UserCircle2 className="w-5 h-5" />
                Edit Profil
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
