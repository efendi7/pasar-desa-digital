'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Store,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Package,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumb } from '@/components/Breadcrumb';
import UserStatsGrid from '@/components/dashboard/UserStatsGrid';
import UserQuickActions from '@/components/dashboard/UserQuickActions';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { FilterToggle } from '@/components/FilterToggle';

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
  const [activeFilter, setActiveFilter] = useState<'latest' | 'popular'>('latest');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const router = useRouter();

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.is_active).length,
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
  };

  const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 10);
  const popularProducts = [...products]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);
  const displayedProducts = activeFilter === 'latest' ? latestProducts : popularProducts;

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [activeFilter]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 pb-24 md:pb-8 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="mb-4">
        <Breadcrumb
          items={[
            { label: 'Dashboard Toko', icon: <Store className="w-4 h-4 mr-1" /> },
          ]}
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-emerald-100 dark:border-zinc-700 overflow-hidden transition-colors duration-300">
        <PageHeader
          title={profile?.store_name || 'Toko Anda'}
          subtitle={`Selamat datang, ${profile?.full_name || 'Pengguna'}`}
          icon={<Store className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />}
        />

        <div className="p-2 sm:p-4 space-y-6">
          <UserStatsGrid stats={stats} />
          <UserQuickActions />

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  {activeFilter === 'latest' ? (
                    <>
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                      Produk Terbaru
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                      Produk Terpopuler
                    </>
                  )}
                </h2>
                <p className="text-emerald-700 dark:text-emerald-400 text-sm">
                  {activeFilter === 'latest'
                    ? '10 produk terbaru dari toko Anda'
                    : '10 produk dengan views terbanyak'}
                </p>
              </div>
              <FilterToggle
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-emerald-50 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-emerald-200 dark:border-zinc-700">
                <Store className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-300 dark:text-emerald-500 mx-auto mb-2" />
                <h3 className="text-md sm:text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  Belum Ada Produk
                </h3>
                <p className="text-emerald-600 dark:text-zinc-400 text-sm mb-4">
                  Tambahkan produk pertama Anda untuk mulai berjualan.
                </p>
                <Link href="/dashboard/products/add">
                  <Button
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-sm sm:text-base"
                  >
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    Tambah Produk
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <div
                  ref={scrollContainerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {displayedProducts.map((product, index) => (
                    <div key={product.id} className="w-full">
                      <ProductCard
                        product={product}
                        index={index}
                        showEdit
                        profileName={profile?.store_name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}