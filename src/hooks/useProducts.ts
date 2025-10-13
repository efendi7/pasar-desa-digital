import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const loadProducts = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserId(user.id);
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading products:', error);
      setLoading(false);
      return;
    }
    setProducts(data || []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const toggleActive = useCallback(async (productId: string, currentStatus: boolean) => {
    if (!userId) return;
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', productId)
      .eq('owner_id', userId);
    if (error) {
      console.error('Error toggling product status:', error);
      return;
    }
    loadProducts();
  }, [supabase, userId, loadProducts]);

  const deleteProduct = useCallback(async (productId: string, imageUrl: string | null) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    if (!userId) return;
    if (imageUrl) {
      const path = imageUrl.split('/product-images/')[1];
      if (path) {
        const { error: storageError } = await supabase.storage.from('product-images').remove([path]);
        if (storageError) console.error('Error deleting image:', storageError);
      }
    }
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('owner_id', userId);
    if (error) {
      console.error('Error deleting product:', error);
      return;
    }
    loadProducts();
  }, [supabase, userId, loadProducts]);

  return { products, loading, userId, refetch: loadProducts, toggleActive, deleteProduct };
}