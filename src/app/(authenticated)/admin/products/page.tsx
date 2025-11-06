'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { ProductCard } from '@/components/ui/ProductCard';
import { Pagination } from '@/components/Pagination';
import { Loader2 } from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    if (!adminLoading && !isAdmin) router.push('/');
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin, currentPage, filterStatus]);

  const fetchProducts = async () => {
    setLoading(true);
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from('products')
      .select('*, profiles(store_name), categories(name)', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (filterStatus === 'active') query = query.eq('is_active', true);
    if (filterStatus === 'inactive') query = query.eq('is_active', false);

    const { data, count, error } = await query;

    if (error) console.error(error);
    else {
      setProducts(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
    );

    const { error } = await supabase
      .from('products')
      .update({ is_active: !current })
      .eq('id', id);

    if (error) {
      alert('Gagal mengubah status: ' + error.message);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: current } : p))
      );
    }
  };

  const handleViewDetail = (id: string) => router.push(`/admin/products/${id}`);

  if (adminLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kelola Produk</h1>
          <p className="text-gray-600 mt-2">
            Admin dapat mengaktifkan / menonaktifkan produk warga
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-3">
          {['all', 'active', 'inactive'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all'
                ? 'Semua'
                : status === 'active'
                ? 'Aktif'
                : 'Nonaktif'}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600">Tidak ada produk.</p>
      ) : (
        <>
          {/* Grid: 2 kolom di mobile, 4 kolom di desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product, index) => (
              <div key={product.id} className="flex flex-col">
                <div
                  onClick={() => handleViewDetail(product.id)}
                  className="cursor-pointer h-full"
                >
                  <ProductCard
                    product={product}
                    showEdit={false}
                    showStore={true}
                    index={index}
                    profileName={product.profiles?.store_name}
                    compact={true}
                  >
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`text-xs font-medium ${
                          product.is_active
                            ? 'text-green-700'
                            : 'text-gray-500'
                        }`}
                      >
                        {product.is_active
                          ? 'Aktif'
                          : 'Nonaktif'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(product.id, product.is_active);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full border transform transition-all duration-300 ${
                          product.is_active
                            ? 'bg-green-600 border-green-600'
                            : 'bg-gray-200 border-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full transition-all duration-300 ${
                            product.is_active
                              ? 'translate-x-6 bg-white shadow-md'
                              : 'translate-x-1 bg-gray-100 shadow-[0_0_4px_rgba(0,0,0,0.25)]'
                          }`}
                        />
                      </button>
                    </div>
                  </ProductCard>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}