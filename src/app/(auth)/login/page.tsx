'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

function LoginContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified')) {
      supabase.auth.signOut();
      setInfo('Email Anda sudah diverifikasi. Silakan login.');
    }
  }, [searchParams, supabase]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
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
      setError('User tidak ditemukan');
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      setError('Gagal memeriksa status akun');
      setLoading(false);
      return;
    }

    if (profile?.is_active) router.push('/dashboard');
    else router.push('/waiting-approval');

    router.refresh();
  };

  return (
    <>
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Masuk ke Akun Anda
        </h2>
        <p className="text-sm text-gray-600 text-center mt-2">
          Kelola produk dan penjualan UMKM Anda
        </p>
      </div>

      {/* Form */}
      <div className="p-8 space-y-5">
        {/* Success Message */}
        {info && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{info}</p>
          </div>
        )}

        {/* Email Input */}
        <FormInput
          label="Alamat Email"
          type="email"
          placeholder="nama@email.com"
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input with Forgot Link */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
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
          onClick={(e) => handleLogin(e)}
          loading={loading}
          icon={<LogIn className="w-5 h-5" />}
          className="w-full"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </PrimaryButton>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">atau</span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Help */}
      <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <Link href="/bantuan" className="text-green-600 hover:underline">
            Bantuan
          </Link>
          <span className="text-gray-300">•</span>
          <Link href="/tentang" className="text-green-600 hover:underline">
            Tentang Kami
          </Link>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"></div>
          <p className="mt-4 text-sm text-gray-600">Memuat halaman...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}