'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Phone, Store, Package, Eye } from 'lucide-react';

const StoreMap = dynamic(() => import('@/components/StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
      <MapPin className="w-8 h-8 text-gray-400" />
    </div>
  ),
});

export default function PublicStorePage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        .select('*')
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
        .select('id, name, price, image_url, views, categories(name)')
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

  const totalProducts = store.products?.length || 0;
  const totalViews = store.products?.reduce((sum: number, p: any) => sum + (p.views || 0), 0) || 0;

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
          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-8 py-6 border-b border-green-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={store.avatar_url || '/default-avatar.png'}
                alt={store.store_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {store.store_name}
                </h1>
                <p className="text-gray-600 mb-4">{store.full_name}</p>
                
                {/* Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
                    <Package className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">{totalProducts}</span>
                    <span className="text-sm text-gray-600">Produk</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">{totalViews}</span>
                    <span className="text-sm text-gray-600">Views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Store Description */}
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

            {/* Contact Button */}
            {store.whatsapp_number && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  Hubungi Toko
                </h2>
                <a
                  href={`https://wa.me/${store.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Hubungi via WhatsApp
                </a>
              </div>
            )}

            {/* Store Location */}
            {store.latitude && store.longitude && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  Lokasi Toko
                </h2>
                
                <div className="rounded-xl overflow-hidden border border-gray-200 mb-3">
                  <StoreMap
                    latitude={store.latitude}
                    longitude={store.longitude}
                    onLocationChange={() => {}}
                    readonly={true}
                  />
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 mb-0.5">Koordinat:</p>
                      <p className="font-mono text-sm text-green-800">
                        {store.latitude.toFixed(6)}, {store.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {store.products.map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={product.image_url || '/no-image.png'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.views > 0 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {product.views}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {product.categories?.name && (
                        <p className="text-xs text-gray-500 mb-2 px-2 py-1 bg-gray-100 rounded inline-block">
                          {product.categories.name}
                        </p>
                      )}
                      
                      <p className="text-lg font-bold text-green-600 mt-2">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Belum ada produk di toko ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}