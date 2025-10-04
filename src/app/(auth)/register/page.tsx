'use client';
import type { FC } from 'react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const RegisterPage: FC = () => {
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    // Panggil fungsi signUp dari Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          store_name: storeName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Daftar Akun UMKM Baru</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Toko / UMKM</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}
          <button type="submit" className="w-full py-2 px-4 text-white bg-green-600 rounded-md hover:bg-green-700">Daftar</button>
        </form>
         <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-green-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;