'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Store, Package } from 'lucide-react';

import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageHeader } from '@/components/PageHeader';
import UserStatsSkeleton from '@/components/dashboard/UserStatsSkeleton';
import ProductSkeletonGrid from '@/components/dashboard/ProductSkeletonGrid';

// Lazy load UserStatsGrid biar cepat
const UserStatsGrid = dynamic(() => import('@/components/dashboard/UserStatsGrid'), {
  loading: () => <UserStatsSkeleton />,
});

interface Product {
  id: string;
  name: string;
  price: number;
  views: number;
  is_active: boolean;
  image_url?: string;
  categories?: { name: string };
  dusun?: { name: string };
  profiles?: { store_name?: string };
}

interface UserProfile {
  store_name?: string;
  full_name?: string;
}

interface UserStats {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
}

interface DashboardClientProps {
  initialProfile: UserProfile;
  initialProducts: Product[];
}

export default function DashboardClient({
  initialProfile,
  initialProducts,
}: DashboardClientProps) {
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // simulasi loading data (ganti nanti dengan fetch Supabase)
    const timeout = setTimeout(() => {
      setStats({
        totalProducts: initialProducts.length,
        activeProducts: initialProducts.filter((p) => p.is_active).length,
        totalViews: initialProducts.reduce((sum, p) => sum + (p.views || 0), 0),
      });
      setProducts(initialProducts);
      setLoadingStats(false);
      setLoadingProducts(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [initialProducts]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 pb-24 md:pb-10 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      {/* 🧭 Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: 'Dashboard Toko', icon: <Store className="w-4 h-4 mr-1" /> },
          ]}
        />
      </div>

      {/* 🏪 Header toko */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-emerald-100 dark:border-zinc-700 overflow-hidden transition-colors duration-300">
        <PageHeader
          title={initialProfile?.store_name || 'Toko Anda'}
          subtitle={`Selamat datang, ${initialProfile?.full_name || 'Pengguna'}`}
          icon={<Store className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />}
        />

        <div className="p-3 sm:p-5 space-y-6">
          {/* Statistik */}
          {loadingStats ? <UserStatsSkeleton /> : <UserStatsGrid stats={stats!} />}

          {/* Produk */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-300 mb-3">
              Produk Saya
            </h2>

            {loadingProducts ? (
              <ProductSkeletonGrid count={4} />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    showEdit
                    profileName={initialProfile.store_name}
                    compact={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-emerald-50 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-emerald-200 dark:border-zinc-700">
                <Store className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-300 dark:text-emerald-500 mx-auto mb-3" />
                <h3 className="text-md sm:text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  Belum Ada Produk
                </h3>
                <p className="text-emerald-600 dark:text-zinc-400 text-sm mb-4">
                  Tambahkan produk pertama Anda untuk mulai berjualan.
                </p>
                <Link href="/dashboard/products/add">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-sm sm:text-base">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    Tambah Produk
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}