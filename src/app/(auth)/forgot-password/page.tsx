'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?type=recovery`,
    });

    if (error) setError(error.message);
    else {
      setMessage('Link reset password telah dikirim. Silakan cek email Anda.');
      setEmail('');
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-100 dark:border-zinc-800">

      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Lupa Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-zinc-400 text-center mt-2">
          Masukkan email Anda untuk menerima link reset password
        </p>
      </div>

      {/* Body */}
      <div className="p-8 space-y-5">

        {/* Success */}
        {message && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl dark:bg-green-900/20 dark:border-green-700 dark:text-green-300">
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Email input (floating label, no placeholder) */}
        <FormInput
          label="Alamat Email"
          type="email"
          icon={<Mail className="w-5 h-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Button */}
        <PrimaryButton
          onClick={handleResetPassword}
          loading={loading}
          icon={<Mail className="w-5 h-5" />}
          className="w-full"
        >
          {loading ? 'Mengirim...' : 'Kirim Link Reset'}
        </PrimaryButton>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400">
              atau
            </span>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-sm text-center flex justify-center items-center gap-1">
  <span className="text-gray-600">Ingat password Anda?</span>

  <Link
    href="/login"
    className="text-green-600 hover:underline font-semibold"
  >
    ← Kembali ke Login
  </Link>
</div>



      </div>
    </div>
  );
}
