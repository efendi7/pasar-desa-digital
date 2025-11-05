// app/(public)/store/StoresClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, Search, MapPin, Package, Eye, Home } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageHeader } from '@/components/PageHeader';
import { FormSelect } from '@/components/FormSelect';
import { Pagination } from '@/components/Pagination';

interface StoreData {
  id: string;
  store_name: string;
  full_name: string;
  store_description: string;
  avatar_url: string;
  cover_image_url: string;
  whatsapp_number: string;
  // Tipe dusun diubah sedikit agar bisa menerima null
  dusun?: { name: string; slug?: string } | null;
  _count: {
    products: number;
    total_views: number;
  };
}

interface Dusun {
  id: string;
  name: string;
  slug: string;
}

interface StoresClientProps {
  initialStores: StoreData[];
  initialDusuns: Dusun[];
}

export default function StoresClient({
  initialStores,
  initialDusuns,
}: StoresClientProps) {
  const router = useRouter();
  const [stores] = useState(initialStores);
  const [dusuns] = useState(initialDusuns);
  const [filteredStores, setFilteredStores] = useState<StoreData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDusun, setSelectedDusun] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset ke page 1 setiap filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDusun, debouncedSearch]);

  // Filter stores
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = stores;

      // Filter dusun
      if (selectedDusun !== 'all') {
        filtered = filtered.filter(
          (s) => s.dusun?.slug === selectedDusun
        );
      }

      // Filter pencarian
      const q = debouncedSearch.trim().toLowerCase();
      if (q) {
        filtered = filtered.filter(
          (s) =>
            s.store_name.toLowerCase().includes(q) ||
            s.full_name.toLowerCase().includes(q) ||
            s.store_description?.toLowerCase().includes(q)
        );
      }

      // FITUR BARU: Sorting
      // Pindahkan toko tanpa nama atau deskripsi ke paling bawah
      filtered.sort((a, b) => {
        // Cek apakah 'a' atau 'b' dianggap "kosong"
        const aIsEmpty = !a.store_name || !a.store_description;
        const bIsEmpty = !b.store_name || !b.store_description;

        if (aIsEmpty && !bIsEmpty) return 1; // 'a' (kosong) pindah ke bawah
        if (!aIsEmpty && bIsEmpty) return -1; // 'b' (kosong) pindah ke bawah
        return 0; // Jaga urutan asli jika keduanya sama
      });

      setFilteredStores(filtered);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedDusun, debouncedSearch, stores]);

  // Pagination
  const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStores = filteredStores.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-zinc-400">
        Memuat toko...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 pb-24 md:pb-10 min-h-screen text-gray-900 dark:text-white">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb
          items={[
            {
              label: 'Beranda',
              href: '/',
              icon: <Home className="w-4 h-4 mr-1" />,
            },
            { label: 'Daftar Toko', icon: <Store className="w-4 h-4 mr-1" /> },
          ]}
        />
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-emerald-100 dark:border-zinc-700 overflow-hidden mb-6">
        <PageHeader
          title="Daftar Toko"
          subtitle="Temukan UMKM dan toko di sekitar Anda"
          icon={
            <Store className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />
          }
        />

        {/* Filter Section */}
        <div className="p-3 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari toko atau pemilik..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              />
            </div>

            {/* Dusun Filter */}
            <FormSelect
              label="Dusun"
              value={selectedDusun}
              onChange={setSelectedDusun}
              options={[
                { value: 'all', label: 'Semua Dusun' },
                ...dusuns.map((d) => ({ value: d.slug, label: d.name })),
              ]}
            />
          </div>

          {/* Info */}
          <div className="mb-4 text-gray-600 dark:text-zinc-400 text-sm md:text-base">
            Menampilkan{' '}
            <span className="font-semibold">{filteredStores.length}</span> toko
          </div>

          {/* Grid toko */}
          {filteredStores.length === 0 ? (
            <div className="text-center py-10 bg-emerald-50 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-emerald-200 dark:border-zinc-700">
              <Store className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-300 dark:text-emerald-500 mx-auto mb-3" />
              <h3 className="text-md sm:text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                Toko Tidak Ditemukan
              </h3>
              <p className="text-emerald-600 dark:text-zinc-400 text-sm mb-4">
                Coba ubah filter atau kata kunci pencarian
              </p>
              <button
                onClick={() => {
                  setSelectedDusun('all');
                  setSearchQuery('');
                  setDebouncedSearch('');
                  setCurrentPage(1);
                }}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition text-sm sm:text-base"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {currentStores.map((store) => (
                  <Link
                    key={store.id}
                    href={`/store/${store.id}`}
                    className="group bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-gray-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-32 sm:h-36 bg-gray-100 dark:bg-zinc-700">
                      {/* Cover Image */}
                      {store.cover_image_url ? (
                        <img
                          src={store.cover_image_url}
                          alt={store.store_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800" />
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                      {/* --- FITUR BARU: AVATAR --- */}
                      <div className="absolute -bottom-6 left-3 sm:left-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white dark:border-zinc-800 shadow-md overflow-hidden bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                        {store.avatar_url ? (
                          <img
                            src={store.avatar_url}
                            alt={store.store_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Store className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                        )}
                      </div>
                      {/* --- END AVATAR --- */}

                      {/* Teks di atas Cover */}
                      {/* Modifikasi: 'left' digeser untuk memberi ruang pada avatar */}
                      <div className="absolute bottom-2 left-16 sm:left-20 right-2">
                        <h3 className="text-white font-semibold text-sm sm:text-base truncate drop-shadow-md">
                          {store.store_name || 'Toko Baru'}
                        </h3>
                        <p className="text-gray-200 text-xs truncate drop-shadow-sm">
                          {store.full_name}
                        </p>
                      </div>
                    </div>

                    {/* Konten Card */}
                    {/* Modifikasi: 'pt' ditambah untuk memberi ruang pada avatar */}
                    <div className="p-3 sm:p-4 space-y-2 pt-8 sm:pt-10">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 min-h-[2.5rem]">
                        {/* Modifikasi: Fallback text */}
                        {store.store_description || 'Tidak ada deskripsi.'}
                      </p>
                      {store.dusun && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
                          <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="truncate">{store.dusun.name}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                          <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-medium">
                            {store._count.products}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                          <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-medium">
                            {store._count.total_views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredStores.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}