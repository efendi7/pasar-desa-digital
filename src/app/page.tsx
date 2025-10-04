'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({ umkm: 0, products: 0, views: 0 });
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

    // Load statistics
    const { count: umkmCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { data: viewsData } = await supabase
      .from('products')
      .select('views');

    const totalViews = viewsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

    setStats({
      umkm: umkmCount || 0,
      products: productCount || 0,
      views: totalViews
    });

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
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative py-20 px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            🎉 Platform UMKM Desa Terpercaya
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-mova">
            Kebumify
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 text-green-50 max-w-3xl mx-auto">
            Etalase Digital untuk Produk UMKM Desa
          </p>
          
          <p className="text-lg mb-10 text-green-100 max-w-2xl mx-auto">
            Jembatan antara produk lokal berkualitas dengan pembeli modern. 
            Promosikan produk UMKM Anda secara online dengan mudah dan gratis!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🛒 Jelajahi Produk
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-green-800 text-white rounded-xl font-bold text-lg hover:bg-green-900 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-white/30"
            >
              📦 Daftar Jadi Penjual
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl mb-3">🏪</div>
            <div className="text-4xl font-bold mb-2">{stats.umkm}+</div>
            <div className="text-blue-100 text-lg">UMKM Terdaftar</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl mb-3">📦</div>
            <div className="text-4xl font-bold mb-2">{stats.products}+</div>
            <div className="text-purple-100 text-lg">Produk Tersedia</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-8 shadow-lg">
            <div className="text-5xl mb-3">👁️</div>
            <div className="text-4xl font-bold mb-2">{stats.views.toLocaleString('id-ID')}+</div>
            <div className="text-orange-100 text-lg">Total Kunjungan</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-gray-600 text-lg">
            Tiga langkah mudah untuk mulai berjualan online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              📝
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">1. Daftar</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Buat Akun UMKM
            </h3>
            <p className="text-gray-600">
              Daftarkan toko Anda dengan mengisi form registrasi sederhana. Gratis selamanya!
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              📸
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-2">2. Upload</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Tambah Produk
            </h3>
            <p className="text-gray-600">
              Upload foto produk, isi deskripsi dan harga. Kelola produk Anda dengan mudah.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              💬
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-2">3. Jual</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Terima Pesanan
            </h3>
            <p className="text-gray-600">
              Pembeli menghubungi via WhatsApp. Transaksi langsung, tanpa potongan!
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Jelajahi Kategori
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 text-center group"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                {category.slug === 'makanan' && '🍔'}
                {category.slug === 'minuman' && '🥤'}
                {category.slug === 'kerajinan' && '🎨'}
                {category.slug === 'pakaian' && '👕'}
                {category.slug === 'pertanian' && '🌾'}
                {category.slug === 'lainnya' && '📦'}
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Produk Terbaru
            </h2>
            <p className="text-gray-600 mt-1">
              Produk fresh dari UMKM lokal
            </p>
          </div>
          <Link
            href="/products"
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 group"
          >
            Lihat Semua
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <div className="text-7xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-gray-600 mb-6">
              Produk dari UMKM akan ditampilkan di sini
            </p>
            <Link
              href="/register"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Jadilah Penjual Pertama!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
              >
                <div className="h-52 bg-gray-200 overflow-hidden relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                      📦
                    </div>
                  )}
                  {product.categories && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700">
                      {product.categories.name}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition text-lg">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                    <span>🏪</span>
                    {product.profiles?.store_name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-gray-400">
                      {product.views || 0} views
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center text-white shadow-2xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Siap Bergabung dengan Kami?
          </h2>
          <p className="text-xl mb-8 text-green-50">
            Ribuan pembeli menunggu produk Anda. Daftar sekarang dan mulai berjualan online tanpa biaya apapun!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition shadow-lg transform hover:-translate-y-1"
            >
              🚀 Daftar Gratis Sekarang
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 bg-green-800 text-white rounded-xl font-bold text-lg hover:bg-green-900 transition shadow-lg transform hover:-translate-y-1 border-2 border-white/30"
            >
              🛍️ Belanja Sekarang
            </Link>
          </div>
          <p className="text-sm text-green-100 mt-6">
            ✨ 100% Gratis • 🚀 Mudah Digunakan • 💬 Transaksi Langsung via WhatsApp
          </p>
        </div>
      </section>
    </div>
  );
}