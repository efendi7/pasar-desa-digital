'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

import { UserPlus, User, Store, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { FormInput } from '@/components/FormInput'
import { PrimaryButton } from '@/components/PrimaryButton'

export default function RegisterContent() {
  const supabase = createClient()
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage('')
    setLoading(true)

    // --- VALIDASI WAJIB ------------------------
    if (!fullName || !storeName || !email || !password) {
      setError('Semua field wajib diisi.')
      setLoading(false)
      return
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      setLoading(false)
      return
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
    })

    // --- ERROR HANDLING ------------------------
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // --- SUCCESS ------------------------------
    setMessage('Akun berhasil dibuat. Silakan cek email untuk verifikasi.')
    setLoading(false)
  }

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
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl dark:bg-green-900/20 dark:border-green-700 dark:text-green-300">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Nama Lengkap */}
        <FormInput
          label="Nama Lengkap"
          type="text"
          icon={<User className="w-5 h-5" />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        {/* Nama Toko */}
        <FormInput
          label="Nama Toko"
          type="text"
          icon={<Store className="w-5 h-5" />}
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
        />

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

        {/* Tombol Daftar */}
        <PrimaryButton type="submit" loading={loading} className="w-full">
          <UserPlus className="w-4 h-4 mr-2" />
          Daftar Sekarang
        </PrimaryButton>

        <p className="text-sm text-center text-gray-600 dark:text-zinc-400 mt-2">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="text-green-600 font-medium hover:underline dark:text-green-400"
          >
            Masuk
          </Link>
        </p>
      </form>
    </div>
  )
}