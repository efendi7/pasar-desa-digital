'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserId(user.id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      setFullName(profile.full_name || '');
      setStoreName(profile.store_name || '');
      setStoreDescription(profile.store_description || '');
      setWhatsappNumber(profile.whatsapp_number || '');
    }

    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (!userId) {
      setError('User tidak terautentikasi');
      setSaving(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          store_name: storeName,
          store_description: storeDescription,
          whatsapp_number: whatsappNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      setSuccess('Profil berhasil diperbarui!');
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupdate profil');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat profil...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-green-600 hover:underline flex items-center gap-2"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Profil Toko
          </h1>
          <p className="text-gray-600 mt-2">
            Perbarui informasi toko Anda yang akan ditampilkan kepada pembeli
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Nama pemilik toko"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Toko / UMKM *
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              placeholder="Contoh: Toko Keripik Bu Siti"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Toko
            </label>
            <textarea
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows={5}
              placeholder="Ceritakan tentang toko/UMKM Anda: produk unggulan, pengalaman, visi, dll."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deskripsi ini akan ditampilkan di halaman profil toko Anda
            </p>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp
            </label>
            <div className="flex gap-2">
              <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l-md text-gray-600">
                +62
              </span>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="8123456789"
                pattern="[0-9]*"
                className="flex-1 px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Nomor ini akan digunakan pembeli untuk menghubungi Anda via WhatsApp
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <span>✓</span>
              {success}
            </div>
          )}

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
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold"
            >
              Batal
            </Link>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold text-gray-800 mb-2">Tips:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Gunakan nama toko yang mudah diingat dan mencerminkan produk Anda</li>
            <li>Deskripsi yang detail membantu pembeli mengenal toko Anda lebih baik</li>
            <li>Pastikan nomor WhatsApp aktif agar pembeli bisa menghubungi Anda</li>
            <li>Perbarui informasi secara berkala agar tetap akurat</li>
          </ul>
        </div>
      </div>
    </div>
  );
}