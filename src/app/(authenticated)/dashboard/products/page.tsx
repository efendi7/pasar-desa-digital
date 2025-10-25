'use client';
import { useState, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { Plus, Home, Eye, Store, Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageHeader } from '@/components/PageHeader';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { ProductStatusButton } from '@/components/ProductStatusButton';
import { ProductImage } from '@/components/ProductImage';
import { ActionButtons } from '@/components/ActionButtons';
import { EmptyState } from '@/components/EmptyState';
import { NoResults } from '@/components/NoResults';
import { FilterStatus, SortByType } from '@/types';
import { Pagination } from '@/components/Pagination';

// ✅ Memoized row component untuk mencegah re-render tidak perlu
const ProductRow = memo(({ product, toggleActive, deleteProduct }: any) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 max-w-[250px]">
      <div className="flex items-center gap-3">
        <ProductImage imageUrl={product.image_url} name={product.name} variant="desktop" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 truncate">{product.name}</div>
          <div className="text-sm text-gray-500 truncate mt-0.5">
            {product.description || 'Tidak ada deskripsi'}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-600 truncate">
      {product.categories?.name || '-'}
    </td>
    <td className="px-6 py-4 font-semibold text-green-600 truncate">
      Rp {product.price.toLocaleString('id-ID')}
    </td>
    <td className="px-6 py-4 text-sm">
      <div className="flex items-center gap-1.5 text-gray-600">
        <Eye size={16} />
        <span className="font-medium">{product.views || 0}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <ProductStatusButton
        isActive={product.is_active}
        onToggle={() => toggleActive(product.id, product.is_active)}
        variant="desktop"
      />
    </td>
    <td className="px-6 py-4">
      <ActionButtons
        productId={product.id}
        imageUrl={product.image_url}
        onDelete={deleteProduct}
        editHref={`/dashboard/products/edit/${product.id}`}
        variant="desktop"
      />
    </td>
  </tr>
));
ProductRow.displayName = 'ProductRow';

// ✅ Memoized card component
const ProductCard = memo(({ product, toggleActive, deleteProduct }: any) => (
  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
    <div className="flex gap-4 mb-4">
      <ProductImage imageUrl={product.image_url} name={product.name} variant="mobile" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-1 mb-2">
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
        <ProductStatusButton
          isActive={product.is_active}
          onToggle={() => toggleActive(product.id, product.is_active)}
          variant="mobile"
          showText={false}
        />
      </div>
    </div>

    <ActionButtons
      productId={product.id}
      imageUrl={product.image_url}
      onDelete={deleteProduct}
      editHref={`/dashboard/products/edit/${product.id}`}
      variant="mobile"
    />
  </div>
));
ProductCard.displayName = 'ProductCard';

export default function ProductsListPage() {
  const { products, loading, toggleActive, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortByType>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Optimasi: Gabungkan filter & sort dalam satu useMemo
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesStatus =
          filterStatus === 'all' ||
          (filterStatus === 'active' && product.is_active) ||
          (filterStatus === 'inactive' && !product.is_active);
        const matchesCategory = filterCategory === 'all' || product.category_id === filterCategory;
        const matchesSearch =
          searchQuery === '' ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        return matchesStatus && matchesCategory && matchesSearch;
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
  }, [products, filterStatus, filterCategory, searchQuery, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterCategory('all');
    setCurrentPage(1);
  }, []);

  // ✅ Options untuk FormSelect
  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Nonaktif', value: 'inactive' },
  ];

  const categoryOptions = [
    { label: 'Semua Kategori', value: 'all' },
    ...categories.map(cat => ({ label: cat.name, value: cat.id })),
  ];

  const sortOptions = [
    { label: 'Terbaru', value: 'newest' },
    { label: 'Terlama', value: 'oldest' },
    { label: 'Paling Banyak Dilihat', value: 'most_views' },
    { label: 'Paling Sedikit Dilihat', value: 'least_views' },
  ];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-8">
      {/* ✅ FIX: Tambah margin bottom untuk spacing */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { href: '/dashboard', label: 'Dashboard Toko', icon: <Store className="w-4 h-4 mr-1" /> },
            { label: 'Daftar Produk' },
          ]}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <PageHeader
          title="Kelola Produk"
          subtitle="Daftar seluruh produk Anda"
          count={products.length}
          actionButton={
            <Link
              href="/dashboard/products/add"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus size={20} />
              Tambah Produk
            </Link>
          }
        />

        {/* ✅ HANYA BAGIAN INI YANG DIGANTI - Filter dengan FormInput & FormSelect */}
        {products.length > 0 && (
          <div className="p-6 sm:p-8 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <FormInput
                label="Cari Produk"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama atau deskripsi..."
                icon={<Search className="w-5 h-5" />}
              />

              {/* Status Filter */}
              <FormSelect
                label="Status"
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as FilterStatus)}
                options={statusOptions}
                placeholder="Pilih status..."
              />

              {/* Category Filter */}
              <FormSelect
                label="Kategori"
                value={filterCategory}
                onChange={setFilterCategory}
                options={categoryOptions}
                placeholder="Pilih kategori..."
              />

              {/* Sort By */}
              <FormSelect
                label="Urutkan"
                value={sortBy}
                onChange={(value) => setSortBy(value as SortByType)}
                options={sortOptions}
                placeholder="Pilih urutan..."
              />
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8">
          {products.length === 0 ? (
            <EmptyState />
          ) : filteredProducts.length === 0 ? (
            <NoResults onReset={handleReset} />
          ) : (
            <>
              {/* ✅ Desktop Table - Dengan will-change untuk optimasi */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead className="bg-gray-50 rounded-t-xl">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-xl w-[30%]">
                        Produk
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                        Kategori
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[12%]">
                        Harga
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[10%]">
                        Views
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[10%]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-xl w-[13%]">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedProducts.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        toggleActive={toggleActive}
                        deleteProduct={deleteProduct}
                      />
                    ))}
                  </tbody>
                </table>

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredProducts.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>

              {/* ✅ Mobile Card - Dengan lazy rendering */}
              <div className="md:hidden space-y-4 mt-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    toggleActive={toggleActive}
                    deleteProduct={deleteProduct}
                  />
                ))}

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredProducts.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Add Button (Mobile) */}
      <Link
        href="/dashboard/products/add"
        className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-2xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 z-50"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}