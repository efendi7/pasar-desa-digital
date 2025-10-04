'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductsListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
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
      loadProducts(); // Reload products
    }
  }

  async function deleteProduct(productId: string, imageUrl: string | null) {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    // Delete image from storage if exists
    if (imageUrl) {
      const path = imageUrl.split('/product-images/')[1];
      if (path) {
        await supabase.storage.from('product-images').remove([path]);
      }
    }

    // Delete product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (!error) {
      loadProducts();
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat produk...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Produk</h1>
          <p className="text-gray-600 mt-1">
            Total {products.length} produk
          </p>
        </div>
        <Link
          href="/dashboard/products/add"
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Tambah Produk
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Belum Ada Produk
          </h2>
          <p className="text-gray-600 mb-6">
            Mulai tambahkan produk pertama Anda untuk ditampilkan di etalase digital
          </p>
          <Link
            href="/dashboard/products/add"
            className="inline-block px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
          >
            Tambah Produk Pertama
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                              📦
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {product.description || 'Tidak ada deskripsi'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.categories?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-green-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.views || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(product.id, product.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/products/edit/${product.id}`}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id, product.image_url)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/dashboard"
          className="text-green-600 hover:underline"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}