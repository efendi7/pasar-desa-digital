'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ResetPasswordContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [checking, setChecking] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Cek token recovery
  useEffect(() => {
    const check = async () => {
      const type = searchParams.get('type');
      if (type !== 'recovery') {
        setErr('Token tidak valid atau sudah kedaluwarsa.');
        setChecking(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setErr('Sesi tidak ditemukan. Link mungkin sudah tidak valid.');
      } else {
        setSessionValid(true);
      }

      setChecking(false);
    };

    check();
  }, [searchParams, supabase]);

  const handleUpdate = async () => {
    setErr('');
    setMsg('');

    if (newPass !== confirmPass) {
      setErr('Password tidak sama.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });

    if (error) setErr(error.message);
    else setMsg('Password berhasil diperbarui! Silakan login kembali.');

    setLoading(false);
  };

  if (checking) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-100 dark:border-zinc-800 p-8 text-center">
        Memeriksa token...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-100 dark:border-zinc-800">

      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-zinc-400 text-center mt-2">
          Masukkan password baru Anda
        </p>
      </div>

      {/* Body */}
      <div className="p-8 space-y-5">

        {/* Error */}
        {err && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{err}</p>
          </div>
        )}

        {/* Success */}
        {msg && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl dark:bg-green-900/20 dark:border-green-700 dark:text-green-300">
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm">{msg}</p>
          </div>
        )}

        {sessionValid && (
          <>
            <FormInput
              label="Password Baru"
              type="password"
              icon={<Lock className="w-5 h-5" />}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
            />

            <FormInput
              label="Konfirmasi Password"
              type="password"
              icon={<Lock className="w-5 h-5" />}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />

            <PrimaryButton
              onClick={handleUpdate}
              loading={loading}
              className="w-full"
            >
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}
