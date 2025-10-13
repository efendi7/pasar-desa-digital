'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useEditProduct(id: string) {
  const supabase = createClient();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      const [{ data: cats }, { data: prod, error: prodErr }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*').eq('id', id).single(),
      ]);

      if (prodErr || !prod) throw new Error('Produk tidak ditemukan');

      setCategories(cats || []);
      setProduct(prod);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProduct(form: any) {
    try {
      setLoading(true);
      setError('');

      const imageUrls: (string | null)[] = [null, null, null, null];

      // Upload gambar baru atau pakai lama
      for (let i = 0; i < 4; i++) {
        const file = form.images[i];
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${i}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          imageUrls[i] = data.publicUrl;
        } else {
          imageUrls[i] = form.oldUrls[i] || null;
        }
      }

      const { error: updateErr } = await supabase
        .from('products')
        .update({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          category_id: form.categoryId || null,
          image_url: imageUrls[0],
          image_url_1: imageUrls[1],
          image_url_2: imageUrls[2],
          image_url_3: imageUrls[3],
        })
        .eq('id', id);

      if (updateErr) throw updateErr;
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui produk');
    } finally {
      setLoading(false);
    }
  }

  return { product, categories, loading, error, updateProduct, setError };
}
