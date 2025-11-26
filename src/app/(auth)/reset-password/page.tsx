'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [status, setStatus] = useState<'checking' | 'ready' | 'success' | 'error'>('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    const type = searchParams.get('type');
    const access_token = searchParams.get('access_token');

    if (type !== 'recovery' || !access_token) {
      setStatus('error');
      setError('Token reset password tidak valid atau sudah kadaluarsa.');
      return;
    }

    // Supabase sudah otomatis login dari magic link, jadi aman
    setStatus('ready');
  }, [searchParams]);

  const handleUpdatePassword = async () => {
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Password dan konfirmasi tidak sama.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setStatus('success');

    setTimeout(() => router.push('/login'), 2000);
  };

  if (status === 'checking') {
    return <p className="p-8 text-center text-gray-500">Memeriksa token...</p>;
  }

  if (status === 'error') {
    return (
      <div className="p-8 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="p-8 space-y-4 text-center">
        <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
        <p className="text-green-700 font-medium">Password berhasil diperbarui!</p>
        <p className="text-gray-600 text-sm">Mengalihkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 text-center mt-2">
          Masukkan password baru Anda
        </p>
      </div>

      <div className="p-8 space-y-5">
        <FormInput
          label="Password Baru"
          type="password"
          placeholder="******"
          icon={<Lock className="w-5 h-5 text-gray-400" />}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <FormInput
          label="Konfirmasi Password Baru"
          type="password"
          placeholder="******"
          icon={<Lock className="w-5 h-5 text-gray-400" />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <PrimaryButton
          onClick={handleUpdatePassword}
          icon={<Lock className="w-5 h-5" />}
          className="w-full"
        >
          Simpan Password Baru
        </PrimaryButton>
      </div>
    </>
  );
}
