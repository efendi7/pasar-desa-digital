'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const StoreMap = dynamic(() => import('@/components/StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
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

  // ✅ Ubah ke null agar GPS auto-detect bisa bekerja
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
        
        // ✅ Hanya set jika ada data dari database
        // Jika null, biarkan GPS auto-detect
        if (profile.latitude && profile.longitude) {
          setLatitude(profile.latitude);
          setLongitude(profile.longitude);
        }
        // ✅ Jika tidak ada koordinat tersimpan, biarkan null
        // StoreMap akan auto-detect GPS atau gunakan default Temanggung
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

      // Upload ke storage Supabase
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Ambil public URL dari file
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update URL avatar di tabel profiles
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

    // ✅ Validasi: koordinat harus sudah terisi
    if (!latitude || !longitude) {
      setError('Mohon set lokasi toko terlebih dahulu (klik tombol GPS atau pilih di peta)');
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
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Edit Profil Toko</h1>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={avatarUrl || '/default-avatar.png'}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Ubah Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleAvatarUpload(e)}
              disabled={uploading}
              className="mt-1 text-sm"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Toko</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi Toko</label>
            <textarea
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Peta lokasi */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi Toko <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Klik tombol GPS untuk auto-detect lokasi Anda, atau klik/geser marker di peta.
            </p>

            {/* ✅ Selalu tampilkan map, biarkan auto-detect GPS */}
            <StoreMap
              latitude={latitude || undefined}
              longitude={longitude || undefined}
              onLocationChange={(lat, lng) => {
                console.log('📍 Location updated:', lat, lng);
                setLatitude(lat);
                setLongitude(lng);
              }}
            />

            {latitude && longitude && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  ✅ <strong>Lokasi tersimpan:</strong>
                </p>
                <p className="text-xs text-gray-600 font-mono mt-1">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              </div>
            )}

            {!latitude && !longitude && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ Lokasi belum diset. Klik tombol GPS atau pilih lokasi di peta.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !latitude || !longitude}
            className="mt-6 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>

          {!latitude && !longitude && (
            <p className="text-xs text-center text-gray-500 mt-2">
              Tombol simpan akan aktif setelah lokasi diset
            </p>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-800">
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}