'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Check if user came from valid reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidToken(true);
      } else {
        setError('Link reset password tidak valid atau sudah kadaluarsa.');
      }
    });
  }, [supabase]);

  const handleUpdatePassword = async () => {
    setError('');
    setMessage('');

    // Validasi password
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
    } else {
      setMessage('Password berhasil diubah! Anda akan diarahkan ke halaman login...');
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }

    setLoading(false);
  };

  if (!isValidToken && !error) {
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

      {/* Form */}
      <div className="p-8 space-y-5">
        {/* Success Message */}
        {message && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{message}</p>
          </div>
        )}

        {isValidToken ? (
          <>
            {/* New Password Input */}
            <FormInput
              label="Password Baru"
              type="password"
              placeholder="Masukkan password baru"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            {/* Confirm Password Input */}
            <FormInput
              label="Konfirmasi Password"
              type="password"
              placeholder="Masukkan ulang password baru"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl">
              <p className="text-xs text-blue-800 font-medium mb-2">Persyaratan Password:</p>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>Minimal 6 karakter</li>
                <li>Kombinasi huruf dan angka (disarankan)</li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <PrimaryButton
              onClick={handleUpdatePassword}
              loading={loading}
              icon={<Lock className="w-5 h-5" />}
              className="w-full"
            >
              {loading ? 'Memproses...' : 'Ubah Password'}
            </PrimaryButton>
          </>
        ) : (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{error}</p>
              <p className="text-xs mt-1">Silakan minta link reset password baru.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Help */}
      <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <a href="/bantuan" className="text-green-600 hover:underline">
            Bantuan
          </a>
          <span className="text-gray-300">•</span>
          <a href="/tentang" className="text-green-600 hover:underline">
            Tentang Kami
          </a>
        </div>
      </div>
    </>
  );
}