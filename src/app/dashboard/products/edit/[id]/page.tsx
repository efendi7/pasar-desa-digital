'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Home, Package, Upload } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageHeader } from '@/components/PageHeader';
import { ImageUploader } from '../../ImageUploader';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { FormTextarea } from '@/components/FormTextArea';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { useEditProduct } from './useEditProduct';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { product, categories, loading, error, updateProduct } = useEditProduct(id as string);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    images: [null, null, null, null] as (File | null)[],
    oldUrls: [null, null, null, null] as (string | null)[],
  });

  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);

  // ⏬ Isi data produk saat sudah terload
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        categoryId: product.category_id || '',
        images: [null, null, null, null],
        oldUrls: [
          product.image_url,
          product.image_url_1,
          product.image_url_2,
          product.image_url_3,
        ],
      });

      setPreviews([
        product.image_url,
        product.image_url_1,
        product.image_url_2,
        product.image_url_3,
      ]);
    }
  }, [product]);

  // ⏫ Handle gambar baru
  const handleImageChange = (i: number, file: File | null) => {
    const newImages = [...form.images];
    const newPreviews = [...previews];

    if (file) {
      newImages[i] = file;
      newPreviews[i] = URL.createObjectURL(file);
    } else {
      if (newPreviews[i]) URL.revokeObjectURL(newPreviews[i]!);
      newImages[i] = null;
      newPreviews[i] = form.oldUrls[i];
    }

    setForm({ ...form, images: newImages });
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProduct(form);
    router.push('/dashboard/products');
  };

  if (loading && !product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Memuat data produk...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { href: '/dashboard', label: 'Beranda', icon: <Home className="w-4 h-4 mr-1" /> },
          { href: '/dashboard/products', label: 'Daftar Produk', icon: <Package className="w-4 h-4 mr-1" /> },
          { label: 'Edit Produk' },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <PageHeader title="Edit Produk" subtitle="Perbarui informasi produk Anda" />

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* 📸 Upload Gambar */}
          <div>
            <label className="font-semibold mb-4 block">Foto Produk</label>
            <ImageUploader slots={form.images} previews={previews} onChange={handleImageChange} />
          </div>

          {/* 🏷 Nama Produk */}
          <FormInput
            label="Nama Produk *"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* 📂 Kategori & 💰 Harga */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormSelect
              label="Kategori"
              value={form.categoryId}
              onChange={(val) => setForm({ ...form, categoryId: String(val) })}
              options={categories.map((c) => ({
                value: String(c.id),
                label: c.name,
              }))}
            />

            <FormInput
              label="Harga (Rp) *"
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          {/* 📝 Deskripsi */}
          <FormTextarea
            label="Deskripsi Produk"
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* ⚠️ Error */}
          {error && (
            <div className="bg-red-50 border text-red-700 px-4 py-3 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* 🧭 Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <PrimaryButton
              type="submit"
              loading={loading}
              icon={<Upload className="w-5 h-5" />}
              className="w-full sm:flex-grow sm:w-auto"
            >
              Update Produk
            </PrimaryButton>

            <SecondaryButton href="/dashboard/products" className="sm:w-auto">
              Batal
            </SecondaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
