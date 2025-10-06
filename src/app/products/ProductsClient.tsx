'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Skeleton Components
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

// Pagination Component
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center gap-1 mt-8 flex-wrap">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        aria-label="Previous page"
      >
        <span>←</span>
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {allPages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              className={`min-w-[40px] px-3 py-2 border rounded-md transition ${
                currentPage === page
                  ? 'bg-green-600 text-white border-green-600'
                  : 'hover:bg-gray-50'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <span>→</span>
      </button>
    </div>
  );
}

interface ProductsClientProps {
  initialPage: number;
  initialCategory: string;
  initialSearch: string;
}

export default function ProductsClient({ 
  initialPage, 
  initialCategory, 
  initialSearch 
}: ProductsClientProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [searchWarning, setSearchWarning] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const ITEMS_PER_PAGE = 12;
  const supabase = createClient();
  const router = useRouter();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (searchQuery !== initialSearch) {
        updateURL(1, selectedCategory, searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter products
  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, debouncedSearch]);

  async function loadData() {
    try {
      setLoading(true);

      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, profiles!inner(store_name), categories(name, slug)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      setProducts(productsData || []);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterProducts() {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (p) => p.categories?.slug === selectedCategory
      );
    }

    // Filter by search query
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
    
    // Reset ke halaman 1 jika hasil filter berubah
    if (currentPage > Math.ceil(filtered.length / ITEMS_PER_PAGE)) {
      setCurrentPage(1);
    }
  }

  function updateURL(page: number, category: string, search: string) {
    const params = new URLSearchParams();
    
    if (page > 1) params.set('page', page.toString());
    if (category !== 'all') params.set('category', category);
    if (search.trim()) params.set('search', search.trim());

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { 
      scroll: false 
    });
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateURL(1, category, searchQuery);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    updateURL(page, selectedCategory, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleResetFilter() {
    setSelectedCategory('all');
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
    updateURL(1, 'all', '');
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const startItem = filteredProducts.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, filteredProducts.length);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Katalog Produk
        </h1>
        <p className="text-gray-600">
          Temukan produk UMKM terbaik dari desa
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk atau toko (min. 3 karakter)..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchWarning && (
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ {searchWarning}
              </p>
            )}
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {/* Results Count */}
      {!loading && (
        <div className="mb-4 text-gray-600 text-sm md:text-base">
          {filteredProducts.length > 0 ? (
            <>
              Menampilkan <span className="font-semibold">{startItem}-{endItem}</span> dari{' '}
              <span className="font-semibold">{filteredProducts.length}</span> produk
              {selectedCategory !== 'all' && (
                <> dalam kategori{' '}
                  <span className="font-semibold">
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                  </span>
                </>
              )}
              {debouncedSearch.trim().length >= 3 && (
                <> dengan kata kunci{' '}
                  <span className="font-semibold">"{debouncedSearch}"</span>
                </>
              )}
            </>
          ) : (
            'Tidak ada produk yang ditampilkan'
          )}
        </div>
      )}

      {/* Products Grid with Skeleton */}
      {loading ? (
        <ProductsGridSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Produk Tidak Ditemukan
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery.trim().length < 3 && searchQuery.trim().length > 0
              ? 'Masukkan minimal 3 karakter untuk pencarian'
              : 'Coba ubah filter atau kata kunci pencarian'}
          </p>
          <button
            onClick={handleResetFilter}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-green-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.profiles?.store_name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.categories && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {product.categories.name}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}