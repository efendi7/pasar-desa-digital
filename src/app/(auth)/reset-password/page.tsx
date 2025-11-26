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

  // 🔥 FIX: Tangkap token dari email lalu setSession()
  useEffect(() => {
    const validateRecoveryLink = async () => {
      setCheckingToken(true);

      const access_token = searchParams.get('access_token');
      const refresh_token = searchParams.get('refresh_token');

      // Jika link mengandung token Supabase → buat session
      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
      }

      // Cek apakah session valid
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('Link reset password tidak valid atau sudah kadaluarsa.');
      }

      setCheckingToken(false);
    };

    validateRecoveryLink();
  }, [searchParams, supabase]);

  // 🔥 Update password
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
