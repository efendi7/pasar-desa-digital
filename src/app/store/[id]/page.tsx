'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import dynamic from 'next/dynamic';

const StoreMap = dynamic(() => import('@/components/StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
      Memuat peta...
    </div>
  ),
});

export default function PublicStorePage() {
  const { id } = useParams();
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

      // Ambil data profil toko
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

      // Ambil produk yang dimiliki toko ini
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, image_url, categories(name)')
        .eq('owner_id', storeId) // ⚠️ ganti sesuai foreign key kamu: owner_id / profile_id / store_id
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat profil toko...</div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6">
        <div className="text-red-600 text-center mb-4">
          {error || 'Toko tidak ditemukan.'}
        </div>
        <div className="text-sm text-gray-500 text-center">
          ID yang dicari: <code className="bg-gray-100 px-2 py-1 rounded">{id}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* --- Informasi toko --- */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={store.avatar_url || '/default-avatar.png'}
            alt={store.store_name}
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{store.store_name}</h1>
            <p className="text-gray-600">{store.full_name}</p>
          </div>
        </div>

        {store.store_description && (
          <p className="text-gray-700 mb-4">{store.store_description}</p>
        )}

        {store.whatsapp_number && (
          <a
            href={`https://wa.me/${store.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6"
          >
            Hubungi via WhatsApp
          </a>
        )}

        {store.latitude && store.longitude && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Lokasi Toko</h2>
            <StoreMap
              latitude={store.latitude}
              longitude={store.longitude}
              onLocationChange={() => {}}
            />
            <p className="mt-2 text-sm text-gray-600">
              Koordinat:{' '}
              <span className="font-mono">
                {store.latitude.toFixed(6)}, {store.longitude.toFixed(6)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* --- Daftar Produk --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Produk dari {store.store_name}
        </h2>

        {store.products && store.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {store.products.map((product: any) => (
              <div
                key={product.id}
                className="bg-gray-50 border rounded-lg p-4 hover:shadow-md transition"
              >
                <img
                  src={product.image_url || '/no-image.png'}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                {product.categories?.name && (
                  <p className="text-sm text-gray-500 mb-1">
                    {product.categories.name}
                  </p>
                )}
                <p className="text-green-600 font-bold">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Belum ada produk di toko ini.
          </p>
        )}
      </div>
    </div>
  );
}
