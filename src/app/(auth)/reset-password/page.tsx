'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, CheckCircle } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

function ResetPasswordContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  // 🔄 FOKUS PERBAIKAN: setSession() harus dilakukan dengan sangat cepat
  useEffect(() => {
    // Gunakan fungsi segera dieksekusi untuk memastikan setCheckingToken(false) selalu dipanggil
    const validateRecoveryLink = async () => {
      // 1. Ambil token dari URL
      const access_token = searchParams.get('access_token');
      const refresh_token = searchParams.get('refresh_token');

      // Pastikan kita sudah selesai memeriksa token, terlepas dari hasilnya
      try {
        setCheckingToken(true);

        // 2. Jika token ada, segera buat session
        if (access_token && refresh_token) {
          // 🔥 PERBAIKAN: setSession DULU
          await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          // Setelah setSession, kita HAPUS token dari URL untuk mencegah pemakaian ulang
          // Ini akan membantu jika pengguna merefresh halaman
          router.replace('/reset-password');
        }

        // 3. Cek apakah session valid setelah setSession
        // (Atau jika pengguna langsung me-refresh halaman tanpa token di URL)
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // Hanya set error jika tidak ada session, yang berarti token gagal di-redeem
          setError('Link reset password tidak valid atau sudah kadaluarsa. Silakan coba minta reset baru.');
        } else {
          // Session aktif, hapus error lama (jika ada)
          setError('');
        }
      } catch (e) {
        // Tangani jika Supabase mengalami error saat setSession
        console.error("Error during session validation:", e);
        setError('Terjadi kesalahan saat memproses link. Coba lagi atau minta reset baru.');
      } finally {
        // Penting: pastikan loading state berakhir
        setCheckingToken(false);
      }
    };

    validateRecoveryLink();
  }, [searchParams, supabase, router]); // Tambahkan router sebagai dependency

  // 🔥 Update password (Logika ini sudah benar, tidak perlu diubah)
  const handleUpdatePassword = async () => {
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('Password harus minimal 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage('Password berhasil diubah! Anda akan diarahkan ke halaman login...');

    setTimeout(async () => {
      // Pastikan logout dan redirect terjadi setelah update berhasil
      await supabase.auth.signOut();
      router.push('/login');
    }, 2000);

    setLoading(false);
  };

  // Loading token verification
  if (checkingToken) {
    return (
      <div className="px-8 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"></div>
        <p className="mt-4 text-sm text-gray-600">Memverifikasi link...</p>
      </div>
    );
  }

  // Sisa komponen (Header, Form, dll.) tetap sama
  return (
    <>
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Buat Password Baru
        </h2>
        <p className="text-sm text-gray-600 text-center mt-2">
          Masukkan password baru untuk akun Anda
        </p>
      </div>

      {/* Form Section */}
      <div className="p-8 space-y-5">

        {/* Success Message */}
        {message && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* ERROR → tampilkan di atas form */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Jika link valid → tampilkan form */}
        {!error && (
          <>
            <FormInput
              label="Password Baru"
              type="password"
              placeholder="Masukkan password baru"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <FormInput
              label="Konfirmasi Password"
              type="password"
              placeholder="Masukkan ulang password baru"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl text-xs text-blue-800">
              Password minimal **6 karakter**
            </div>

            <PrimaryButton
              className="w-full"
              loading={loading}
              onClick={handleUpdatePassword}
            >
              Ubah Password
            </PrimaryButton>
          </>
        )}
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}