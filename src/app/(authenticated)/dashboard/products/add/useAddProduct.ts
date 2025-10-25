'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

/**
 * Hook untuk menambah produk baru ke database Supabase
 * Termasuk upload gambar ke Supabase Storage dan validasi user login
 */
export function useAddProduct() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [dusuns, setDusuns] = useState<any[]>([]); // 👈 1. Add state for dusuns
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Ambil user login, kategori & dusun saat pertama kali render
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Ambil daftar kategori
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (!catError && categoriesData) {
        setCategories(categoriesData);
      }

      // 👈 2. Fetch dusuns data
      const { data: dusunsData, error: dusunError } = await supabase
        .from('dusun')
        .select('*')
        .order('name');
      
      if (!dusunError && dusunsData) {
        setDusuns(dusunsData);
      }
    })();
  }, [router, supabase]);

  /**
   * 🔹 Upload maksimal 4 gambar ke Supabase Storage
   */
  async function uploadImages(slots: (File | null)[], userId: string) {
    const urls: (string | null)[] = Array(4).fill(null);
    await Promise.all(
      slots.map(async (file, i) => {
        if (!file) return;

        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}_${i}.${ext}`;
        const path = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        urls[i] = data.publicUrl;
      })
    );
    return urls;
  }

  /**
   * 🔹 Submit produk baru ke database
   */
  async function submitProduct(form: {
    name: string;
    description: string;
    price: string;
    categoryId: string;
    dusunId: string; // 👈 3. Add dusunId to the function parameter type
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
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category_id: form.categoryId || null,
        dusun_id: form.dusunId || null, // 👈 4. Add dusun_id to the insert object
        image_url: imageUrls[0],
        image_url_1: imageUrls[1],
        image_url_2: imageUrls[2],
        image_url_3: imageUrls[3],
        is_active: true,
      });

      if (insertError) throw insertError;

      router.push('/dashboard/products');
    } catch (err: any) {
      console.error('Error saat menambah produk:', err);
      setError(err.message || 'Terjadi kesalahan saat menambah produk');
    } finally {
      setLoading(false);
    }
  }

  return {
    categories,
    dusuns, // 👈 5. Return dusuns so the page component can use it
    loading,
    error,
    submitProduct,
    setError,
  };
}