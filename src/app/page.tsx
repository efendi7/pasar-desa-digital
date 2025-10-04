'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // Load latest products (8 produk terbaru)
    const { data: productsData } = await supabase
      .from('products')
      .select('*, profiles(store_name), categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);

    setProducts(productsData || []);

    // Load categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    setCategories(categoriesData || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20 rounded-lg mb-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            Pasar Desa Digital
          </h1>
          <p className="text-xl mb-8 text-green-50">
            Etalase Digital untuk Produk UMKM Desa
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-3 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Lihat Semua Produk
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-green-800 text-white rounded-lg font-semibold hover:bg-green-900 transition"
            >
              Daftar Jadi Penjual
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Kategori Produk
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-center group"
            >
              <div className="text-4xl mb-2">
                {category.slug === 'makanan' && '🍔'}
                {category.slug === 'minuman' && '🥤'}
                {category.slug === 'kerajinan' && '🎨'}
                {category.slug === 'pakaian' && '👕'}
                {category.slug === 'pertanian' && '🌾'}
                {category.slug === 'lainnya' && '📦'}
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-green-600">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Produk Terbaru
          </h2>
          <Link
            href="/products"
            className="text-green-600 hover:underline font-semibold"
          >
            Lihat Semua →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-gray-600">
              Produk dari UMKM akan ditampilkan di sini
            </p>
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
      </section>

      {/* CTA Section */}
      <section className="mt-16 bg-green-50 rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Punya Produk UMKM?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Bergabunglah dengan Pasar Desa Digital dan promosikan produk Anda secara online.
          Gratis dan mudah digunakan!
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Daftar Sekarang
        </Link>
      </section>
    </div>
  );
}