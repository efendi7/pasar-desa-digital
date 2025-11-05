'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { ArrowLeft, MapPin, Phone, Store, Package, Eye } from 'lucide-react';

const StoreMap = dynamic(() => import('@/components/StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
      <MapPin className="w-8 h-8 text-gray-400" />
    </div>
  ),
});

// === Fungsi Utilitas ===
function getInitials(name: string): string {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

// Format nomor WhatsApp agar selalu pakai kode 62
const formatWhatsAppNumber = (number: string) => {
  if (!number) return '';
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.startsWith('62')) return cleaned;
  if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
  return '62' + cleaned;
};

export default function PublicStorePage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('ID toko tidak valid.');
      setLoading(false);
      return;
    }

    async function fetchStore() {
      const storeId = Array.isArray(id) ? id[0] : id;

      const { data: storeData, error: storeError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          store_name,
          store_description,
          whatsapp_number,
          avatar_url,
          cover_image_url,
          latitude,
          longitude,
          created_at,
          dusun(name, slug)
        `)
        .eq('id', storeId)
        .single();

      if (storeError || !storeData) {
        console.error('Gagal memuat profil toko:', storeError);
        setError('Toko tidak ditemukan.');
        setLoading(false);
        return;
      }

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          image_url,
          views,
          created_at,
          categories(name, slug)
        `)
        .eq('owner_id', storeId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Gagal memuat produk:', productsError);
      }

      setStore({
        ...storeData,
        products: productsData || [],
      });
      setLoading(false);
    }

    fetchStore();
  }, [id, supabase]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Memuat profil toko...
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <Store className="w-16 h-16 text-red-400 mb-4" />
        <div className="text-red-600 text-center mb-4">
          {error || 'Toko tidak ditemukan.'}
        </div>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Kembali ke Beranda</span>
        </button>
      </div>
    );
  }

  // === Hitung Statistik ===
  const totalProducts = store.products?.length || 0;
  const totalViews =
    store.products?.reduce((sum: number, p: any) => sum + (p.views || 0), 0) || 0;
  const initials = getInitials(store.store_name || store.full_name);
  const avatarColor = getAvatarColor(store.store_name || store.full_name);

  // === WhatsApp URL dengan pesan umum ===
  const whatsappMessage = encodeURIComponent(
    `Halo ${store.store_name || 'Toko'}, saya tertarik dengan produk di toko Anda. Bisa bantu informasi lebih lanjut?`
  );
  const whatsappUrl = store.whatsapp_number
    ? `https://wa.me/${formatWhatsAppNumber(store.whatsapp_number)}?text=${whatsappMessage}`
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Kembali ke Beranda</span>
        </button>

        {/* Store Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          {/* Cover Image */}
          {store.cover_image_url && (
            <div className="h-48 sm:h-64 w-full overflow-hidden">
              <img
                src={store.cover_image_url}
                alt={`Cover ${store.store_name}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div
            className={`px-4 sm:px-8 py-6 border-b border-green-200 transition-all duration-300 ${
              store.cover_image_url
                ? '-mt-16 bg-gradient-to-r from-green-50 to-green-100/50'
                : 'bg-gradient-to-r from-green-50 to-green-100/50'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Avatar */}
              {store.avatar_url ? (
                <img
                  src={store.avatar_url}
                  alt={store.store_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const initialsDiv = document.createElement('div');
                      initialsDiv.className = `w-24 h-24 rounded-full ${avatarColor} border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold`;
                      initialsDiv.textContent = initials;
                      parent.appendChild(initialsDiv);
                    }
                  }}
                />
              ) : (
                <div
                  className={`w-24 h-24 rounded-full ${avatarColor} border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {initials}
                </div>
              )}

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {store.store_name}
                </h1>
                <p className="text-gray-600 mb-2">{store.full_name}</p>
                {store.dusun?.name && (
                  <p className="text-sm text-gray-600 flex items-center justify-center sm:justify-start gap-1 mb-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>{store.dusun.name}</span>
                  </p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white rounded-lg shadow-sm">
                    <Package className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      {totalProducts}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">Produk</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white rounded-lg shadow-sm">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      {totalViews}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">Views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Deskripsi Toko */}
            {store.store_description && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  Tentang Toko
                </h2>
                <p className="text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-xl border border-gray-200">
                  {store.store_description}
                </p>
              </div>
            )}

            {/* WhatsApp - Desktop */}
            {store.whatsapp_number && (
              <div className="hidden sm:block">
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  Hubungi Toko
                </h2>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Hubungi via WhatsApp
                </a>
              </div>
            )}

            {/* Lokasi + Koordinat + Tombol Maps */}
            {store.latitude && store.longitude && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  Lokasi Toko
                </h2>
                <div className="rounded-xl overflow-hidden border border-gray-200 h-64 sm:h-80">
                  <StoreMap
                    latitude={store.latitude}
                    longitude={store.longitude}
                    onLocationChange={() => {}}
                    readonly={true}
                  />
                </div>

                {/* Koordinat */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-green-600" />
                    Koordinat: {store.latitude.toFixed(6)}, {store.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs mt-1">Gunakan GPS untuk navigasi langsung</p>
                </div>

                {/* Tombol Maps */}
                <div className="mt-2 flex gap-2">
                  <a
                    href={`https://maps.google.com/?q=${store.latitude},${store.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-3 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Buka di Google Maps
                  </a>
                  <a
                    href={`geo:${store.latitude},${store.longitude}`}
                    className="flex-1 text-center py-2 px-3 bg-green-600 text-white text-sm rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Navigasi GPS
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-8 py-6 border-b border-green-200">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-green-700" />
              <h2 className="text-2xl font-bold text-gray-900">
                Produk dari {store.store_name}
              </h2>
            </div>
          </div>
          <div className="p-8">
            {store.products && store.products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {store.products.map((product: any, index: number) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <ProductCard
                      product={product}
                      showEdit={false}
                      showStore={false}
                      index={index}
                      compact={true}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Belum ada produk di toko ini.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Floating WhatsApp Button (Mobile Only) */}
        {store.whatsapp_number && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`sm:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full shadow-2xl hover:from-green-700 hover:to-green-800 font-semibold transition-all ${
              showFloatingButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            <Phone className="w-5 h-5" />
            <span>Hubungi</span>
          </a>
        )}
      </div>
    </div>
  );
}