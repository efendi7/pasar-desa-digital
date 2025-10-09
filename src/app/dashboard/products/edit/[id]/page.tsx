'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, ImagePlus, Loader2 } from 'lucide-react';

interface ImageSlot {
  file: File | null;
  preview: string | null;
  oldUrl?: string | null;
}

export default function EditProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
    { file: null, preview: null },
  ]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      loadProductAndCategories();
    }
  }, [id]);

  async function loadProductAndCategories() {
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const [{ data: categoriesData }, { data: productData, error: productError }] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*').eq('id', id).single(),
    ]);

    if (productError || !productData) {
      setError('Produk tidak ditemukan');
      setLoading(false);
      return;
    }

    setCategories(categoriesData || []);
    setName(productData.name);
    setDescription(productData.description || '');
    setPrice(productData.price.toString());
    setCategoryId(productData.category_id || '');

    // Atur gambar lama ke slot
    const urls = [
      productData.image_url,
      productData.image_url_1,
      productData.image_url_2,
      productData.image_url_3,
    ];
    const slots = urls.map((url) => ({
      file: null,
      preview: url,
      oldUrl: url,
    }));
    setImageSlots(slots);
    setLoading(false);
  }

  function handleImageChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      const newSlots = [...imageSlots];
      newSlots[index] = {
        file,
        preview: URL.createObjectURL(file),
        oldUrl: imageSlots[index].oldUrl,
      };
      setImageSlots(newSlots);
    }
  }

  function removeImage(index: number) {
    const newSlots = [...imageSlots];
    if (newSlots[index].preview && newSlots[index].file) {
      URL.revokeObjectURL(newSlots[index].preview!);
    }
    newSlots[index] = { file: null, preview: null, oldUrl: null };
    setImageSlots(newSlots);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const imageUrls: (string | null)[] = [null, null, null, null];

      // Upload hanya file baru, biarkan yang lama tetap dipakai
      const uploadPromises = imageSlots.map(async (slot, index) => {
        if (slot.file) {
          const fileExt = slot.file.name.split('.').pop();
          const fileName = `${Date.now()}_${index}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, slot.file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          imageUrls[index] = data.publicUrl;
        } else {
          imageUrls[index] = slot.oldUrl || null;
        }
      });

      await Promise.all(uploadPromises);

      const { error: updateError } = await supabase
        .from('products')
        .update({
          name,
          description,
          price: parseFloat(price),
          category_id: categoryId || null,
          image_url: imageUrls[0],
          image_url_1: imageUrls[1],
          image_url_2: imageUrls[2],
          image_url_3: imageUrls[3],
        })
        .eq('id', id);

      if (updateError) throw updateError;

      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui produk');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Memuat data produk...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Kembali ke Daftar Produk</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-8 py-6 border-b border-green-200">
          <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi produk Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Upload Gambar */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-4">
              Foto Produk
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageSlots.map((slot, index) => (
                <div key={index} className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                    className="hidden"
                    id={`image-${index}`}
                  />
                  <label
                    htmlFor={`image-${index}`}
                    className={`block aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                      slot.preview
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/50'
                    }`}
                  >
                    {slot.preview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={slot.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeImage(index);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-lg">
                            Utama
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <ImagePlus className="w-8 h-8 mb-2" />
                        <span className="text-xs font-medium">
                          {index === 0 ? 'Foto Utama' : `Foto ${index + 1}`}
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Nama Produk */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Nama Produk
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Kategori & Harga */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Harga (Rp)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Deskripsi Produk
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 font-semibold shadow-lg transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Update Produk</span>
                </>
              )}
            </button>
            <Link
              href="/dashboard/products"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-center transition-all"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
