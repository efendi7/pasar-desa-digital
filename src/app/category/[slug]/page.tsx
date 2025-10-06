'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';

// Skeleton Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded-lg w-20" />
          <div className="h-5 bg-gray-200 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Category Icons & Colors
const categoryConfig: Record<string, { icon: string; gradient: string; bg: string }> = {
  makanan: {
    icon: '🍽️',
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-gradient-to-br from-orange-50 to-red-50',
  },
  minuman: {
    icon: '☕',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
  },
  kerajinan: {
    icon: '🎨',
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
  },
  pakaian: {
    icon: '👔',
    gradient: 'from-indigo-500 to-blue-500',
    bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
  },
  pertanian: {
    icon: '🌾',
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
  },
  lainnya: {
    icon: '✨',
    gradient: 'from-gray-500 to-slate-500',
    bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
  },
};

export default function CategoryPage() {
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClient();
  const params = useParams();
  const slug = params.slug as string;

  const config = categoryConfig[slug] || categoryConfig.lainnya;

  useEffect(() => {
    loadCategoryAndProducts();
  }, [slug]);

  async function loadCategoryAndProducts() {
    try {
      // Load category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (categoryError || !categoryData) {
        setError('Kategori tidak ditemukan');
        setLoading(false);
        return;
      }

      setCategory(categoryData);

      // Load products in this category
      const { data: productsData } = await supabase
        .from('products')
        .select('*, profiles!inner(store_name), categories(name)')
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      setProducts(productsData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Skeleton Breadcrumb */}
        <div className="mb-6 h-5 bg-gray-200 rounded-lg w-64 animate-pulse" />
        
        {/* Skeleton Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-200 rounded-lg w-48" />
              <div className="h-5 bg-gray-200 rounded-lg w-32" />
            </div>
          </div>
        </div>

        <ProductsGridSkeleton />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">😞</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {error || 'Kategori Tidak Ditemukan'}
          </h2>
          <p className="text-gray-600 mb-8">
            Kategori yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-600">
          <li>
            <Link href="/" className="hover:text-green-600 transition">
              Beranda
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-green-600 transition">
              Produk
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{category.name}</li>
        </ol>
      </nav>

      {/* Category Header - Enhanced */}
      <div className={`${config.bg} rounded-3xl shadow-lg p-8 mb-8 border border-white/50`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Icon */}
          <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
            {config.icon}
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {category.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="w-5 h-5" />
              <span className="text-lg">
                {products.length} produk tersedia
              </span>
            </div>
          </div>

          {/* Back Button - Desktop */}
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Semua Kategori</span>
          </Link>
        </div>
      </div>

      {/* Products Grid or Empty State */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">{config.icon}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Belum Ada Produk
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Belum ada produk dalam kategori {category.name}. 
            Coba jelajahi kategori lain atau lihat semua produk kami.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Package className="w-5 h-5" />
            Lihat Semua Produk
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 group border border-gray-100 hover:border-green-200"
              >
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
                      {config.icon}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {product.profiles?.store_name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-lg font-medium">
                      {product.categories?.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back Link - Mobile & Bottom */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Lihat Semua Produk</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}