'use client';

import { useState } from 'react';
import { Home, Package, Upload } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageHeader } from '@/components/PageHeader';
import { ImageUploader } from '../ImageUploader';
import { useAddProduct } from './useAddProduct';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { FormTextarea } from '@/components/FormTextArea';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';

export default function AddProductPage() {
  const { categories, dusuns, loading, error, submitProduct } = useAddProduct();

  console.log('Isi state dusuns:', dusuns);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    dusunId: '',
    images: [null, null, null, null] as (File | null)[],
  });

  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null]);

  const handleImageChange = (i: number, file: File | null) => {
    const newImages = [...form.images];
    const newPreviews = [...previews];
    if (file) {
      newImages[i] = file;
      newPreviews[i] = URL.createObjectURL(file);
    } else {
      if (newPreviews[i]) URL.revokeObjectURL(newPreviews[i]!);
      newImages[i] = null;
      newPreviews[i] = null;
    }
    setForm({ ...form, images: newImages });
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProduct(form);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-8">
      {/* 🧭 Breadcrumb Navigation - ✅ Tambah wrapper dengan margin bottom */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { href: '/dashboard', label: 'Beranda', icon: <Home className="w-4 h-4 mr-1" /> },
            { href: '/dashboard/products', label: 'Daftar Produk', icon: <Package className="w-4 h-4 mr-1" /> },
            { label: 'Tambah Produk' },
          ]}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <PageHeader title="Tambah Produk Baru" subtitle="Lengkapi informasi produk Anda" />

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* 📸 Upload Gambar */}
          <div>
            <label className="font-semibold mb-4 block">Foto Produk *</label>
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

          {/* 📂 Kategori, Dusun & 💰 Harga */}
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

            <FormSelect
              label="Dusun"
              value={form.dusunId}
              onChange={(val) => setForm({ ...form, dusunId: String(val) })}
              options={dusuns.map((d) => ({
                value: String(d.id),
                label: d.name,
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

          {/* ⚠️ Error Message */}
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
              Simpan Produk
            </PrimaryButton>

            <SecondaryButton
              href="/dashboard/products"
              className="sm:w-auto"
            >
              Batal
            </SecondaryButton>
          </div>

        </form>
      </div>
    </div>
  );
}