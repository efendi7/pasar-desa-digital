'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Search, Home, Package } from 'lucide-react';

import { ProductCard } from '@/components/ui/ProductCard';
import { Pagination } from '@/components/Pagination';
import { PageHeader } from '@/components/PageHeader';
import { Breadcrumb } from '@/components/Breadcrumb';
import { FormSelect } from '@/components/FormSelect';
import ProductSkeletonGrid from '@/components/dashboard/ProductSkeletonGrid';

// 🦾 Lazy-load ProductGrid (opsional biar cepat render)
const ProductGrid = dynamic(() => import('@/components/dashboard/ProductGrid'), {
  loading: () => <ProductSkeletonGrid count={8} />,
});

interface ProductsClientProps {
  initialPage: number;
  initialCategory: string;
  initialDusun: string;
  initialSearch: string;
  initialProducts: any[];
  initialCategories: any[];
  initialDusuns: any[];
  totalCount: number;
}

export default function ProductsClient({
  initialPage,
  initialCategory,
  initialDusun,
  initialSearch,
  initialProducts,
  initialCategories,
  initialDusuns,
}: ProductsClientProps) {
  const router = useRouter();

  const [products] = useState(initialProducts);
  const [categories] = useState(initialCategories);
  const [dusuns] = useState(initialDusuns);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDusun, setSelectedDusun] = useState(initialDusun);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [searchWarning, setSearchWarning] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const ITEMS_PER_PAGE = 8;

  // Debounce pencarian
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset ke page 1 setiap filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDusun, debouncedSearch]);

  // Filter produk
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = products;

      if (selectedCategory !== 'all') {
        filtered = filtered.filter((p) => p.categories?.slug === selectedCategory);
      }

      if (selectedDusun !== 'all') {
        filtered = filtered.filter((p) => p.profiles?.dusun?.slug === selectedDusun);
      }

      const trimmedQuery = debouncedSearch.trim();
      if (trimmedQuery) {
        if (trimmedQuery.length < 3) {
          setSearchWarning('Minimal 3 karakter untuk pencarian');
        } else {
          setSearchWarning('');
          const query = trimmedQuery.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.profiles?.store_name?.toLowerCase().includes(query)
          );
        }
      } else {
        setSearchWarning('');
      }

      setFilteredProducts(filtered);
      updateURL(currentPage, selectedCategory, selectedDusun, debouncedSearch);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedDusun, debouncedSearch, currentPage]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const startItem = filteredProducts.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, filteredProducts.length);

  function updateURL(page: number, category: string, dusun: string, search: string) {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (category !== 'all') params.set('category', category);
    if (dusun !== 'all') params.set('dusun', dusun);
    if (search.trim().length >= 3) params.set('search', search.trim());
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ⬇️ UI
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0 dark:text-white">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Beranda', href: '/', icon: <Home className="w-4 h-4 mr-1" /> },
          { label: 'Katalog Produk', icon: <Package className="w-4 h-4 mr-1" /> },
        ]}
        className="dark:text-zinc-400"
      />

      {/* Page Header */}
      <PageHeader
        title="Katalog Produk"
        subtitle="Temukan produk UMKM terbaik dari desa"
      />

      {/* Filter Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden mb-8">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk atau toko..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white transition"
            />
            {searchWarning && (
              <p className="text-xs text-orange-600 mt-1">⚠️ {searchWarning}</p>
            )}
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

          {/* Kategori Filter */}
          <FormSelect
            label="Kategori"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { value: 'all', label: 'Semua Kategori' },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
          />
        </div>
      </div>

      {/* Info */}
      {!loading && (
        <div className="mb-4 text-gray-600 dark:text-zinc-400 text-sm md:text-base">
          {filteredProducts.length > 0 ? (
            <>
              Menampilkan <span className="font-semibold">{startItem}-{endItem}</span> dari{' '}
              <span className="font-semibold">{filteredProducts.length}</span> produk
            </>
          ) : (
            'Tidak ada produk yang ditampilkan'
          )}
        </div>
      )}

      {/* Produk Grid */}
      {loading ? (
        <ProductSkeletonGrid count={8} />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-700 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Produk Tidak Ditemukan</h3>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">
            {searchQuery.trim().length < 3 && searchQuery.trim().length > 0
              ? 'Masukkan minimal 3 karakter untuk pencarian'
              : 'Coba ubah filter atau kata kunci pencarian'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDusun('all');
              setSearchQuery('');
              setDebouncedSearch('');
              setCurrentPage(1);
              updateURL(1, 'all', 'all', '');
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <>
          {/* 🧩 Ubah grid jadi 2 kolom di mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {currentProducts.map((product, index) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <ProductCard product={product} showEdit={false} showStore={true} index={index} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
