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

    if (error) {
      setError(error.message);
    } else {
      setMessage('Link reset password telah dikirim ke email Anda. Silakan cek inbox atau spam.');
      setEmail('');
    }

    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Lupa Password
        </h2>
        <p className="text-sm text-gray-600 text-center mt-2">
          Masukkan email Anda untuk menerima link reset password
        </p>
      </div>

      {/* Form */}
      <div className="p-8 space-y-5">
        {message && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm">{message}</p>
          </div>
        )}

        <FormInput
          label="Alamat Email"
          type="email"
          placeholder="nama@email.com"
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <PrimaryButton
          onClick={handleResetPassword}
          loading={loading}
          icon={<Mail className="w-5 h-5" />}
          className="w-full"
        >
          {loading ? 'Mengirim...' : 'Kirim Link Reset'}
        </PrimaryButton>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">atau</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Ingat password Anda?{' '}
            <Link
              href="/login"
              className="font-semibold text-green-600 hover:text-green-700 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
