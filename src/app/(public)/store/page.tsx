'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Store, MapPin, Package, Eye, Search, Filter } from 'lucide-react';

interface StoreData {
  id: string;
  store_name: string;
  full_name: string;
  store_description: string;
  avatar_url: string;
  whatsapp_number: string;
  latitude: number;
  longitude: number;
  dusun_id: string;
  dusun?: { name: string };
  _count: {
    products: number;
    total_views: number;
  };
}

interface Dusun {
  id: string;
  name: string;
}

// Komponen Avatar dengan Inisial
function StoreAvatar({ store }: { store: StoreData }) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getColorFromName = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  if (!store.avatar_url || imageError) {
    return (
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow-md group-hover:scale-105 transition-transform ${getColorFromName(
          store.store_name
        )}`}
      >
        {getInitials(store.store_name)}
      </div>
    );
  }

  return (
    <img
      src={store.avatar_url}
      alt={store.store_name}
      onError={() => setImageError(true)}
      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
    />
  );
}

export default function StoresListPage() {
  const router = useRouter();
  const supabase = createClient();

  const [stores, setStores] = useState<StoreData[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreData[]>([]);
  const [dusunList, setDusunList] = useState<Dusun[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDusun, setSelectedDusun] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterStores();
  }, [searchQuery, selectedDusun, stores]);

  async function fetchData() {
    try {
      // Fetch dusun list
      const { data: dusunData } = await supabase
        .from('dusun')
        .select('id, name')
        .order('name');

      setDusunList(dusunData || []);

      const { data: storesData, error: storesError } = await supabase
        .from('profiles')
        .select(`
          id,
          store_name,
          full_name,
          store_description,
          avatar_url,
          whatsapp_number,
          latitude,
          longitude,
          dusun_id,
          dusun:dusun_id ( name )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (storesError) {
        console.error('Error fetching stores:', storesError);
        setLoading(false);
        return;
      }

      const storesNormalized = (storesData || []).map((store) => ({
        ...store,
        dusun: Array.isArray(store.dusun) ? store.dusun[0] : store.dusun,
      }));

      const storesWithCounts = await Promise.all(
        storesNormalized.map(async (store) => {
          const { data: products } = await supabase
            .from('products')
            .select('id, views')
            .eq('owner_id', store.id)
            .eq('is_active', true);

          const productCount = products?.length || 0;
          const totalViews = products?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

          return {
            ...store,
            _count: {
              products: productCount,
              total_views: totalViews,
            },
          };
        })
      );

      setStores(storesWithCounts);
      setFilteredStores(storesWithCounts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterStores() {
    let filtered = [...stores];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (store) =>
          store.store_name.toLowerCase().includes(query) ||
          store.full_name.toLowerCase().includes(query) ||
          store.store_description?.toLowerCase().includes(query)
      );
    }

    if (selectedDusun) {
      filtered = filtered.filter((store) => store.dusun_id === selectedDusun);
    }

    setFilteredStores(filtered);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat daftar toko...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Daftar Toko</h1>
          </div>
          <p className="text-gray-600">
            Temukan {stores.length} toko terdaftar di platform kami
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari toko atau pemilik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Dusun Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedDusun}
                onChange={(e) => setSelectedDusun(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Semua Dusun</option>
                {dusunList.map((dusun) => (
                  <option key={dusun.id} value={dusun.id}>
                    {dusun.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold">{filteredStores.length}</span> dari{' '}
              <span className="font-semibold">{stores.length}</span> toko
            </p>
          </div>
        </div>

        {/* Stores Grid */}
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                onClick={() => router.push(`/store/${store.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Store Header */}
                <div className="bg-gradient-to-r from-green-50 to-green-100/50 p-6 border-b border-green-200">
                  <div className="flex items-start gap-4">
                    <StoreAvatar store={store} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-green-600 transition-colors">
                        {store.store_name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{store.full_name}</p>
                    </div>
                  </div>
                </div>

                {/* Store Info */}
                <div className="p-6">
                  {/* Description */}
                  {store.store_description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {store.store_description}
                    </p>
                  )}

                  {/* Location */}
                  {store.dusun && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="truncate">{store.dusun.name}</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <Package className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Produk</p>
                        <p className="font-semibold text-gray-900">
                          {store._count.products}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <Eye className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Views</p>
                        <p className="font-semibold text-gray-900">
                          {store._count.total_views}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Store Button */}
                <div className="px-6 pb-6">
                  <button className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Lihat Toko
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada toko ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}