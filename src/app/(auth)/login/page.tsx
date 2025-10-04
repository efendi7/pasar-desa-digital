'use client';
import type { FC } from 'react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPage: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
      router.refresh(); // Penting untuk refresh state di server
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login UMKM</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full py-2 px-4 text-white bg-green-600 rounded-md hover:bg-green-700">Login</button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-green-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;