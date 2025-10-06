'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, ImagePlus, Loader2 } from 'lucide-react';

interface ImageSlot {
  file: File | null;
  preview: string | null;
}

export default function AddProductPage() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkUserAndLoadCategories();
  }, []);

  async function checkUserAndLoadCategories() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserId(user.id);

    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    setCategories(categoriesData || []);
  }

  function handleImageChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      const newSlots = [...imageSlots];
      newSlots[index] = {
        file,
        preview: URL.createObjectURL(file),
      };
      setImageSlots(newSlots);
    }
  }

  function removeImage(index: number) {
    const newSlots = [...imageSlots];
    if (newSlots[index].preview) {
      URL.revokeObjectURL(newSlots[index].preview!);
    }
    newSlots[index] = { file: null, preview: null };
    setImageSlots(newSlots);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!userId) {
      setError('User tidak terautentikasi');
      setLoading(false);
      return;
    }

    try {
      const imageUrls: (string | null)[] = [null, null, null, null];

      // Upload images in parallel for faster performance
      const uploadPromises = imageSlots.map(async (slot, index) => {
        if (slot.file) {
          const fileExt = slot.file.name.split('.').pop();
          const fileName = `${userId}/${Date.now()}_${index}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, slot.file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          imageUrls[index] = data.publicUrl;
        }
      });

      await Promise.all(uploadPromises);

      // Insert product
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          owner_id: userId,
          name,
          description,
          price: parseFloat(price),
          category_id: categoryId || null,
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Kembali ke Daftar Produk</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-8 py-6 border-b border-green-200">
          <h1 className="text-3xl font-bold text-gray-900">
            Tambah Produk Baru
          </h1>
          <p className="text-gray-600 mt-1">
            Lengkapi informasi produk Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Image Upload Section - 4 Slots */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-4">
              Foto Produk <span className="text-red-500">*</span>
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
            <p className="text-sm text-gray-500 mt-3">
              Upload hingga 4 gambar. Foto pertama akan menjadi gambar utama. Format: JPG, PNG, WEBP (maks. 5MB)
            </p>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Contoh: Keripik Singkong Original"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category & Price Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="100"
                placeholder="15000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Deskripsi Produk
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Jelaskan detail produk: bahan, ukuran, varian rasa, keunggulan produk, dll."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Simpan Produk</span>
                </>
              )}
            </button>
            <Link
              href="/dashboard/products"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold text-center transition-all duration-200"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}