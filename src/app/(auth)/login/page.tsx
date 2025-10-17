'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LogIn, Mail, Lock } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';

// Pisahkan logic utama ke komponen anak
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
      setInfo('✅ Email Anda sudah diverifikasi. Silakan login.');
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
    <div className="max-w-md mx-auto px-4 pt-10 pb-16">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <PageHeader
          title="Login UMKM"
          subtitle="Masuk ke akun Anda untuk mengelola produk dan penjualan"
        />

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {info && (
            <div className="bg-green-50 border text-green-700 px-4 py-3 rounded-xl">
              {info}
            </div>
          )}

          <FormInput
            label="Email"
            type="email"
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            label="Password"
            type="password"
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border text-red-700 px-4 py-3 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          <PrimaryButton
            type="submit"
            loading={loading}
            icon={<LogIn className="w-5 h-5" />}
            className="w-full"
          >
            Masuk
          </PrimaryButton>

          <div className="text-sm text-center text-gray-600">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-medium text-green-600 hover:underline"
            >
              Daftar di sini
            </Link>
          </div>
        </form>

        <div className="p-6 border-t text-center">
          <SecondaryButton href="/" className="w-full">
            Kembali ke Beranda
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

// Bungkus dengan Suspense di komponen utama
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
