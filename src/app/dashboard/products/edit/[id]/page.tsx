'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    loadProductAndCategories();
  }, [productId]);

  async function loadProductAndCategories() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserId(user.id);

    // Load product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('owner_id', user.id)
      .single();

    if (productError || !product) {
      setError('Produk tidak ditemukan');
      setLoading(false);
      return;
    }

    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setCategoryId(product.category_id || '');
    setIsActive(product.is_active);
    setCurrentImageUrl(product.image_url);

    // Load categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    setCategories(categoriesData || []);
    setLoading(false);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let imageUrl = currentImageUrl;

      // Upload new image if exists
      if (newImage && userId) {
        // Delete old image if exists
        if (currentImageUrl) {
          const oldPath = currentImageUrl.split('/product-images/')[1];
          if (oldPath) {
            await supabase.storage.from('product-images').remove([oldPath]);
          }
        }

        // Upload new image
        const fileExt = newImage.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, newImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Update product
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name,
          description,
          price: parseFloat(price),
          category_id: categoryId || null,
          image_url: imageUrl,
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupdate produk');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat produk...</div>
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
        <div className="mt-4 text-center">
          <Link href="/dashboard/products" className="text-green-600 hover:underline">
            ← Kembali ke Daftar Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/products"
          className="text-green-600 hover:underline flex items-center gap-2"
        >
          ← Kembali ke Daftar Produk
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Edit Produk
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Produk
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : currentImageUrl ? (
                    <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-5xl">📷</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload gambar baru untuk mengganti foto saat ini
                </p>
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Produk *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Harga (Rp) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="100"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Produk
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Tampilkan produk ini (Aktif)
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <Link
              href="/dashboard/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}