'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Pagination } from '@/components/Pagination'; // ✅ gunakan komponen eksternal

// --- Skeleton Loading ---
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
// --- End Skeleton ---

interface ProductsClientProps {
  initialPage: number;
  initialCategory: string;
  initialSearch: string;
  initialProducts: any[];
  initialCategories: any[];
  totalCount: number; 
}

export default function ProductsClient({
  initialPage,
  initialCategory,
  initialSearch,
  initialProducts,
  initialCategories,
  totalCount,
}: ProductsClientProps) {
  const [products] = useState<any[]>(initialProducts);
  const [categories] = useState<any[]>(initialCategories);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [searchWarning, setSearchWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const ITEMS_PER_PAGE = 8;
  const router = useRouter();

  // --- debounce pencarian ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- filter produk berdasarkan kategori & pencarian ---
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      filterProducts();
      updateURL(1, selectedCategory, debouncedSearch);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, debouncedSearch]);

  function filterProducts() {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categories?.slug === selectedCategory);
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
            p.profiles?.store_name.toLowerCase().includes(query)
        );
      }
    } else {
      setSearchWarning('');
    }

    setFilteredProducts(filtered);
    if (currentPage > Math.ceil(filtered.length / ITEMS_PER_PAGE)) {
      setCurrentPage(1);
    }
    setLoading(false);
  }

  // --- update URL sesuai state ---
  function updateURL(page: number, category: string, search: string) {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (category !== 'all') params.set('category', category);
    if (search.trim().length >= 3) params.set('search', search.trim());
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }

  // --- pagination logic ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const startItem = filteredProducts.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, filteredProducts.length);

  // --- handler ganti halaman + scroll ke atas ---
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, selectedCategory, debouncedSearch);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ scroll ke atas
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-600">
          <li>
            <Link href="/" className="hover:text-green-600 transition">
              Beranda
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Katalog Produk</li>
        </ol>
      </nav>

      {/* Header & Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 relative">
        <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-8 py-6 border-b border-green-200">
          <h1 className="text-3xl font-bold text-gray-900">Katalog Produk</h1>
          <p className="text-gray-600 mt-1">
            Temukan produk UMKM terbaik dari desa
          </p>
        </div>

        {/* Filter Section */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk atau toko (min. 3 karakter)..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                suppressHydrationWarning
              />
              {searchWarning && (
                <p className="text-xs text-orange-600 mt-1">⚠️ {searchWarning}</p>
              )}
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                suppressHydrationWarning
              >
                <option value="all">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {!loading && (
        <div className="mb-4 text-gray-600 text-sm md:text-base">
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

      {/* Products Grid */}
      {loading ? (
        <ProductsGridSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Produk Tidak Ditemukan</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery.trim().length < 3 && searchQuery.trim().length > 0
              ? 'Masukkan minimal 3 karakter untuk pencarian'
              : 'Coba ubah filter atau kata kunci pencarian'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setDebouncedSearch('');
              setCurrentPage(1);
              updateURL(1, 'all', '');
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            suppressHydrationWarning
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProducts.map((product, index) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <ProductCard 
                  product={product} 
                  showEdit={false}
                  showStore={true}
                  index={index}
                />
              </Link>
            ))}
          </div>

          {/* ✅ gunakan Pagination eksternal */}
          <Pagination
            currentPage={currentPage}
             totalItems={totalCount} 
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
