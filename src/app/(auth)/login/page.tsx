'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

import { LogIn, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function LoginContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pesan setelah verifikasi email
  useEffect(() => {
    if (searchParams.get('verified')) {
      supabase.auth.signOut();
      setInfo('Email Anda sudah diverifikasi. Silakan login.');
    }
  }, [searchParams, supabase]);

  // Fungsi login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo('');
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError('User tidak ditemukan.');
      setLoading(false);
      return;
    }

    // Cek apakah user aktif / menunggu approval
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      setError('Gagal memeriksa status akun.');
      setLoading(false);
      return;
    }

    if (profile?.is_active) router.push('/dashboard');
    else router.push('/waiting-approval');

    router.refresh();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-100 dark:border-zinc-800">

      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Masuk ke Akun Anda
        </h2>
        <p className="text-sm text-gray-600 dark:text-zinc-400 text-center mt-2">
          Kelola produk dan penjualan UMKM Anda
        </p>
      </div>

      {/* Body Form */}
      <form onSubmit={handleLogin} className="p-8 space-y-5">

        {/* Info Message (verified) */}
        {info && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl dark:bg-green-900/20 dark:border-green-700 dark:text-green-300">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{info}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Email */}
        <FormInput
          label="Alamat Email"
          type="email"
          icon={<Mail className="w-5 h-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <FormInput
          label="Password"
          type="password"
          icon={<Lock className="w-5 h-5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="text-right -mt-2">
          <Link
            href="/forgot-password"
            className="text-sm text-green-600 hover:underline dark:text-green-400"
          >
            Lupa kata sandi?
          </Link>
        </div>

        {/* Tombol Login */}
        <PrimaryButton type="submit" loading={loading} className="w-full">
          <LogIn className="w-4 h-4 mr-2" />
          Masuk
        </PrimaryButton>

        <p className="text-sm text-center text-gray-600 dark:text-zinc-400 mt-2">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="text-green-600 font-medium hover:underline dark:text-green-400"
          >
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
