'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CategoryPage() {
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClient();
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    loadCategoryAndProducts();
  }, [slug]);

  async function loadCategoryAndProducts() {
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
      .select('*, profiles(store_name), categories(name)')
      .eq('category_id', categoryData.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    setProducts(productsData || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat produk...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {error || 'Kategori Tidak Ditemukan'}
        </h2>
        <Link href="/products" className="text-green-600 hover:underline">
          ← Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-green-600">Beranda</Link>
        {' > '}
        <Link href="/products" className="hover:text-green-600">Produk</Link>
        {' > '}
        <span className="text-gray-800">{category.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">
            {slug === 'makanan' && '🍔'}
            {slug === 'minuman' && '🥤'}
            {slug === 'kerajinan' && '🎨'}
            {slug === 'pakaian' && '👕'}
            {slug === 'pertanian' && '🌾'}
            {slug === 'lainnya' && '📦'}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {category.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {products.length} produk tersedia
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Belum Ada Produk
          </h3>
          <p className="text-gray-600 mb-6">
            Belum ada produk dalam kategori {category.name}
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Lihat Semua Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {product.categories.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Back Link */}
      <div className="mt-12 text-center">
        <Link href="/products" className="text-green-600 hover:underline">
          ← Lihat Semua Produk
        </Link>
      </div>
    </div>
  );
}