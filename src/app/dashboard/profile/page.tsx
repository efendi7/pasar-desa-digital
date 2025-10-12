'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';

const StoreMap = dynamic(() => import('@/components/StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
      Memuat peta...
    </div>
  ),
});

export default function EditProfilePage() {
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
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
        setAvatarUrl(profile.avatar_url || null);
        if (profile.latitude && profile.longitude) {
          setLatitude(profile.latitude);
          setLongitude(profile.longitude);
        }
      }

      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      setError('');
      setSuccess('');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSuccess('Foto profil berhasil diunggah!');
    } catch (err: any) {
      console.error(err);
      setError('Gagal mengunggah foto profil');
    } finally {
      setUploading(false);
    }
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

    if (!latitude || !longitude) {
      setError('Mohon set lokasi toko terlebih dahulu');
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
          latitude,
          longitude,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      setSuccess('Profil berhasil diperbarui!');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupdate profil');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Memuat profil...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Kembali ke Dashboard</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-8 py-6 border-b border-green-200">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profil Toko</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi dan lokasi toko Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <img
              src={avatarUrl || '/default-avatar.png'}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
            />
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Foto Profil
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-600"
              />
              {uploading && (
                <p className="text-xs text-gray-500 mt-1">Mengunggah foto...</p>
              )}
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Nama Toko
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Deskripsi Toko
            </label>
            <textarea
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows={4}
              placeholder="Ceritakan tentang toko Anda..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Peta Lokasi */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Lokasi Toko <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Klik tombol GPS untuk auto-detect lokasi Anda, atau pilih manual di peta.
            </p>

            <StoreMap
              latitude={latitude || undefined}
              longitude={longitude || undefined}
              onLocationChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />

            {latitude && longitude ? (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
                ✅ Lokasi tersimpan: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
            ) : (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                ⚠️ Lokasi belum diset.
              </div>
            )}
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={saving || !latitude || !longitude}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>

            <Link
              href="/dashboard"
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
