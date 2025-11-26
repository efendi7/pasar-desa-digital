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

  // cek apakah token valid
  useEffect(() => {
    const check = async () => {
      const type = searchParams.get('type');
      if (type !== 'recovery') {
        setErr('Token tidak valid atau sudah kadaluarsa.');
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

    if (error) {
      setErr(error.message);
    } else {
      setMsg('Password berhasil diperbarui! Anda bisa login kembali.');
    }

    setLoading(false);
  };

  if (checking) {
    return <div className="p-8 text-center">Memeriksa token...</div>;
  }

  return (
    <div className="p-8 space-y-5">
      <h2 className="text-xl font-bold">Reset Password</h2>

      {err && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <p>{err}</p>
        </div>
      )}

      {msg && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
          <CheckCircle className="w-5 h-5" />
          <p>{msg}</p>
        </div>
      )}

      {sessionValid && (
        <>
          <FormInput
            label="Password Baru"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />

          <FormInput
            label="Konfirmasi Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5 text-gray-400" />}
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
  );
}
