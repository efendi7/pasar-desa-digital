'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function useAddProduct() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      setUserId(user.id);

      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    })();
  }, []);

  async function uploadImages(slots: (File | null)[], userId: string) {
    const urls: (string | null)[] = Array(4).fill(null);

    await Promise.all(
      slots.map(async (file, i) => {
        if (!file) return;
        const ext = file.name.split('.').pop();
        const path = `${userId}/${Date.now()}_${i}.${ext}`;

        const { error } = await supabase.storage.from('product-images').upload(path, file);
        if (error) throw error;

        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        urls[i] = data.publicUrl;
      })
    );
    return urls;
  }

  async function submitProduct(form: {
    name: string;
    description: string;
    price: string;
    categoryId: string;
    images: (File | null)[];
  }) {
    setLoading(true);
    setError('');

    if (!userId) {
      setError('User tidak terautentikasi');
      setLoading(false);
      return;
    }

    try {
      const imageUrls = await uploadImages(form.images, userId);
      const { error: insertError } = await supabase.from('products').insert({
        owner_id: userId,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category_id: form.categoryId || null,
        image_url: imageUrls[0],
        image_url_1: imageUrls[1],
        image_url_2: imageUrls[2],
        image_url_3: imageUrls[3],
        is_active: true,
      });

      if (insertError) throw insertError;
      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menambah produk');
    } finally {
      setLoading(false);
    }
  }

  return { categories, loading, error, submitProduct, setError };
}
