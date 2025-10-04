'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function UMKMProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClient();
  const params = useParams();
  const umkmId = params.id as string;

  useEffect(() => {
    loadUMKMProfile();
  }, [umkmId]);

  async function loadUMKMProfile() {
    // Load UMKM profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', umkmId)
      .eq('is_active', true)
      .single();

    if (profileError || !profileData) {
      setError('Toko tidak ditemukan atau tidak aktif');
      setLoading(false);
      return;
    }

    setProfile(profileData);

    // Load all products from this UMKM
    const { data: productsData } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('owner_id', umkmId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    setProducts(productsData || []);
    setLoading(false);
  }

  function handleWhatsAppClick() {
    if (!profile?.whatsapp_number) {
      alert('Nomor WhatsApp belum tersedia');
      return;
    }

    const phone = profile.whatsapp_number.startsWith('62')
      ? profile.whatsapp_number
      : `62${profile.whatsapp_number}`;

    const message = `Halo ${profile.store_name}, saya ingin bertanya tentang produk Anda.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat profil toko...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {error || 'Toko Tidak Ditemukan'}
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
        <span className="text-gray-800">{profile.store_name}</span>
      </div>

      {/* Store Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Store Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              {profile.store_name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Store Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {profile.store_name}
            </h1>
            <p className="text-gray-600 mb-4">
              Pemilik: {profile.full_name}
            </p>

            {profile.store_description && (
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">
                {profile.store_description}
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {products.length}
                </div>
                <div className="text-sm text-gray-600">Produk</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {products.reduce((sum, p) => sum + (p.views || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </div>

            {/* WhatsApp Button */}
            {profile.whatsapp_number && (
              <button
                onClick={handleWhatsAppClick}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                <span className="text-xl">💬</span>
                Hubungi via WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Produk dari {profile.store_name}
        </h2>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-gray-600">
              Toko ini belum menambahkan produk
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
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-green-600">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.categories && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {product.categories.name}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {product.views || 0} views
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Back Link */}
      <div className="mt-12 text-center">
        <Link href="/products" className="text-green-600 hover:underline">
          ← Lihat Semua Produk
        </Link>
      </div>
    </div>
  );
}