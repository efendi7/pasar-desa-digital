'use client'

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

import { CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    setLoading(true);

    // --- VALIDASI WAJIB ------------------------
    if (!fullName || !storeName || !email || !password) {
      setError("Semua field wajib diisi.");
      setLoading(false);
      return;
    }

    // --- SIGNUP SUPABASE -----------------------
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          store_name: storeName,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    // --- ERROR HANDLING ------------------------
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // --- SUCCESS ------------------------------
    setMessage('Akun berhasil dibuat. Silakan cek email untuk verifikasi.');
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-100 dark:border-zinc-800">

      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Buat Akun UMKM
        </h2>
        <p className="text-sm text-gray-600 dark:text-zinc-400 text-center mt-2">
          Daftarkan toko dan mulai jual produk Anda
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="p-8 space-y-5">
        
        {/* Success message */}
        {message && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
            <CheckCircle className="w-5 h-5 mt-0.5" />
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border red-200 text-red-800 px-4 py-3 rounded-xl">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            className="input-field"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Toko</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            type="text"
            className="input-field"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="input-field"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          {loading ? "Mendaftarkan..." : "Daftar"}
        </button>
      </form>
    </div>
  );
}
