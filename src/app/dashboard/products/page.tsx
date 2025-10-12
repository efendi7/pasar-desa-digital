'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Package, Eye, Check, X, Edit, Trash2, ArrowLeft } from 'lucide-react';

export default function ProductsListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_views' | 'least_views'>('newest');
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserId(user.id);

    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    setProducts(data || []);
    setLoading(false);
  }

  async function toggleActive(productId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', productId);

    if (!error) {
      loadProducts();
    }
  }

  async function deleteProduct(productId: string, imageUrl: string | null) {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    if (imageUrl) {
      const path = imageUrl.split('/product-images/')[1];
      if (path) {
        await supabase.storage.from('product-images').remove([path]);
      }
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (!error) {
      loadProducts();
    }
  }

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'active' && product.is_active) ||
        (filterStatus === 'inactive' && !product.is_active);
      
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'most_views':
          return (b.views || 0) - (a.views || 0);
        case 'least_views':
          return (a.views || 0) - (b.views || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Kembali ke Dashboard</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-6 sm:px-8 py-6 border-b border-green-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
              <p className="text-gray-600 mt-1">
                Total {products.length} produk terdaftar
              </p>
            </div>
            <Link
              href="/dashboard/products/add"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus size={20} />
              Tambah Produk
            </Link>
          </div>
        </div>

        {/* Filter and Search Section */}
        {products.length > 0 && (
          <div className="px-6 sm:px-8 py-6 space-y-4 border-b border-gray-100">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama atau deskripsi produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Filters Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Status Produk
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      filterStatus === 'all'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setFilterStatus('active')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      filterStatus === 'active'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Aktif
                  </button>
                  <button
                    onClick={() => setFilterStatus('inactive')}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      filterStatus === 'inactive'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Nonaktif
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Urutkan Berdasarkan
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="most_views">Views Terbanyak</option>
                  <option value="least_views">Views Tersedikit</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products Content */}
        <div className="p-6 sm:p-8">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gray-100 rounded-full">
                  <Package size={64} className="text-gray-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Belum Ada Produk
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Mulai tambahkan produk pertama Anda untuk ditampilkan di etalase digital
              </p>
              <Link
                href="/dashboard/products/add"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus size={20} />
                Tambah Produk Pertama
              </Link>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gray-100 rounded-full">
                  <Search size={64} className="text-gray-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Tidak Ada Hasil
              </h2>
              <p className="text-gray-600 mb-8">
                Tidak ada produk yang cocok dengan filter atau pencarian Anda
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <>
              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 rounded-t-xl">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-xl">
                        Produk
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-xl">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package size={28} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-gray-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                                {product.description || 'Tidak ada deskripsi'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                            {product.categories?.name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-green-600">
                            Rp {product.price.toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Eye size={16} />
                            <span className="font-medium">{product.views || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleActive(product.id, product.is_active)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              product.is_active
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {product.is_active ? (
                              <>
                                <Check size={14} />
                                <span>Aktif</span>
                              </>
                            ) : (
                              <>
                                <X size={14} />
                                <span>Nonaktif</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/dashboard/products/edit/${product.id}`}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-1.5"
                            >
                              <Edit size={16} />
                              Edit
                            </Link>
                            <button
                              onClick={() => deleteProduct(product.id, product.image_url)}
                              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-1.5"
                            >
                              <Trash2 size={16} />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Cards */}
              <div className="md:hidden space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 border border-gray-300">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                          {product.description || 'Tidak ada deskripsi'}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-800">
                          {product.categories?.name || '-'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500 mb-1 font-medium">Harga</div>
                        <div className="font-semibold text-green-600">
                          Rp {product.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1 font-medium">Views</div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye size={16} />
                          <span className="font-medium">{product.views || 0}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1 font-medium">Status</div>
                        <button
                          onClick={() => toggleActive(product.id, product.is_active)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                            product.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {product.is_active ? <Check size={12} /> : <X size={12} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/products/edit/${product.id}`}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 font-medium transition-colors text-center flex items-center justify-center gap-1.5"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id, product.image_url)}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={16} />
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <Link
        href="/dashboard/products/add"
        className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-2xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 z-50"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}