'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { UserPlus, Mail, Lock, Store, User } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';

export default function RegisterPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login?verified=true`,
        data: {
          full_name: fullName,
          store_name: storeName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('✅ Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
      setFullName('');
      setStoreName('');
      setEmail('');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-16">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <PageHeader
          title="Daftar Akun UMKM"
          subtitle="Buat akun baru untuk mengelola produk dan toko Anda"
        />

        <form onSubmit={handleSignUp} className="p-8 space-y-6">
          <FormInput
            label="Nama Lengkap"
            type="text"
            icon={<User className="w-5 h-5" />}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <FormInput
            label="Nama Toko / UMKM"
            type="text"
            icon={<Store className="w-5 h-5" />}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />

          <FormInput
            label="Email"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            label="Password"
            type="password"
            icon={<Lock className="w-5 h-5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border text-red-700 px-4 py-3 rounded-xl">
              ⚠️ {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 border text-green-700 px-4 py-3 rounded-xl">
              {message}
            </div>
          )}

          <PrimaryButton
            type="submit"
            loading={loading}
            icon={<UserPlus className="w-5 h-5" />}
            className="w-full"
          >
            Daftar
          </PrimaryButton>

          <p className="text-sm text-center text-gray-600">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-medium text-green-600 hover:underline"
            >
              Login di sini
            </Link>
          </p>
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
