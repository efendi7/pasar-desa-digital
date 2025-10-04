'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchWarning, setSearchWarning] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  async function loadData() {
    // Load all active products
    const { data: productsData } = await supabase
      .from('products')
      .select('*, profiles(store_name), categories(name, slug)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    setProducts(productsData || []);
    setFilteredProducts(productsData || []);

    // Load categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    setCategories(categoriesData || []);
    setLoading(false);
  }

  function filterProducts() {
  let filtered = products;

  // Filter by category
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(
      (p) => p.categories?.slug === selectedCategory
    );
  }

  // Filter by search query (minimal 3 karakter)
  const trimmedQuery = searchQuery.trim();
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
}

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat produk...</div>
      </div>
    );
  }

  return (
    <div>
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
              onChange={(e) => setSelectedCategory(e.target.value)}
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
      <div className="mb-4 text-gray-600">
        Menampilkan {filteredProducts.length} produk
        {selectedCategory !== 'all' &&
          ` dalam kategori ${
            categories.find((c) => c.slug === selectedCategory)?.name
          }`}
        {searchQuery.trim().length >= 3 && ` dengan kata kunci "${searchQuery}"`}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
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
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
                    📦
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-green-600">
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
      )}
    </div>
  );
}