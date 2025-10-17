'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useAdminProducts() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil produk + relasi kategori & toko
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          stores(name)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    })();
  }, []);

  // 🔹 Toggle status aktif/nonaktif
  async function toggleActive(productId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', productId);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, is_active: !currentStatus } : p
        )
      );
    }
  }

  // 🔹 Hapus produk dari database & storage
  async function deleteProduct(productId: string, imageUrl?: string) {
    // Hapus file dari storage jika ada
    if (imageUrl) {
      try {
        const imagePath = imageUrl.split('/product-images/')[1];
        await supabase.storage.from('product-images').remove([imagePath]);
      } catch (err) {
        console.warn('Gagal hapus gambar:', err);
      }
    }

    // Hapus dari tabel products
    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  }

  return { products, loading, toggleActive, deleteProduct };
}
