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
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
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
  const [activeFilter, setActiveFilter] = useState<'latest' | 'popular'>(
    'latest'
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const router = useRouter();

  // Statistik
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.is_active).length,
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
  };

  // Filter produk
  const latestProducts = [...products]
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 10);

  const popularProducts = [...products]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const displayedProducts =
    activeFilter === 'latest' ? latestProducts : popularProducts;

  // Reset scroll saat filter berubah
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeFilter]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const firstCard = container.querySelector('.card') as HTMLElement;
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 24;
        container.scrollBy({
          left: direction === 'right' ? scrollAmount : -scrollAmount,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 min-h-screen">
      <div className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
        <PageHeader
          title={`${profile?.store_name || 'Toko'}`}
          subtitle={`Selamat datang, ${profile?.full_name || 'Pengguna'}`}
          icon={<Store className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />}
        />

        <div className="p-4 sm:p-8 space-y-8">
          <UserStatsGrid stats={stats} />
          <UserQuickActions />

          {/* Produk Terbaru / Populer */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                  {activeFilter === 'latest' ? (
                    <>
                      <Sparkles className="h-6 w-6 text-emerald-600" />
                      Produk Terbaru
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                      Produk Terpopuler
                    </>
                  )}
                </h2>
                <p className="text-emerald-700 text-sm">
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
              <div className="text-center py-12 bg-emerald-50 rounded-xl border-2 border-dashed border-emerald-200">
                <Store className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  Belum Ada Produk
                </h3>
                <p className="text-emerald-600 mb-6">
                  Tambahkan produk pertama Anda untuk mulai berjualan.
                </p>
                <Link href="/dashboard/products/add">
                  <Button variant="primary">
                    <Store className="w-5 h-5" />
                    Tambah Produk
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <div
                  ref={scrollContainerRef}
                  className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 pb-8"
                  style={{
                    maskImage:
                      'linear-gradient(to right, black 85%, transparent)',
                  }}
                >
                  {displayedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="card relative min-w-[80%] sm:min-w-[50%] md:min-w-[33%] lg:min-w-[25%]"
                    >
                      <ProductCard
                        product={product}
                        index={index}
                        showEdit
                        profileName={profile?.store_name}
                      />
                      {/* PERMINTAAN 1: Tampilkan ArrowRight di setiap produk */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md pointer-events-none">
                        <ArrowRight className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tombol navigasi scroll */}
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between pointer-events-none">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12 bg-white/80 border border-emerald-200 shadow-md hover:scale-105 active:scale-95 transition-transform pointer-events-auto"
                    onClick={() => handleScroll('left')}
                  >
                    <ArrowLeft className="h-5 w-5 text-emerald-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12 bg-white/80 border border-emerald-200 shadow-md hover:scale-105 active:scale-95 transition-transform pointer-events-auto"
                    onClick={() => handleScroll('right')}
                  >
                    <ArrowRight className="h-5 w-5 text-emerald-600" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}