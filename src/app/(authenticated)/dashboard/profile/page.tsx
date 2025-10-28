'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  ArrowLeft,
  Loader2,
  Upload,
  Store,
  User,
  MapPin,
  Phone,
  FileText,
  Camera,
} from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageHeader } from '@/components/PageHeader'
import { FormInput } from '@/components/FormInput'
import { FormTextarea } from '@/components/FormTextArea'
import { FormSelect } from '@/components/FormSelect'

const StoreMap = dynamic(() => import('@/components/StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
      <MapPin className="w-8 h-8 text-gray-400" />
    </div>
  ),
})

export default function EditProfilePage() {
  const [fullName, setFullName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storeDescription, setStoreDescription] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [dusunId, setDusunId] = useState<string | null>(null)
  const [dusunList, setDusunList] = useState<{ id: string; name: string }[]>([])

  const [imageError, setImageError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const getInitials = (name: string) => {
    if (!name) return '?'
    const words = name.trim().split(' ')
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-teal-500 to-teal-600',
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  // Load profile dan dusun list
  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      // ambil dusun
      const { data: dusunData } = await supabase.from('dusun').select('id, name').order('name')
      if (dusunData) setDusunList(dusunData)

      // ambil profil
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

      if (profile) {
        setFullName(profile.full_name || '')
        setStoreName(profile.store_name || '')
        setStoreDescription(profile.store_description || '')
        setWhatsappNumber(profile.whatsapp_number || '')
        setAvatarUrl(profile.avatar_url || null)
        setDusunId(profile.dusun_id || null)
        if (profile.latitude && profile.longitude) {
          setLatitude(profile.latitude)
          setLongitude(profile.longitude)
        }
      }

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      setError('')
      setSuccess('')

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
      setImageError(false)
      setSuccess('Foto profil berhasil diunggah!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      console.error(err)
      setError('Gagal mengunggah foto profil')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (!userId) {
      setError('User tidak terautentikasi')
      setSaving(false)
      return
    }

    if (!latitude || !longitude) {
      setError('Mohon set lokasi toko terlebih dahulu')
      setSaving(false)
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          store_name: storeName,
          store_description: storeDescription,
          whatsapp_number: whatsappNumber,
          dusun_id: dusunId,
          latitude,
          longitude,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (updateError) throw updateError

      setSuccess('Profil berhasil diperbarui!')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupdate profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  const initials = getInitials(storeName || fullName)
  const avatarColor = getAvatarColor(storeName || fullName || 'User')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-8">
      <Breadcrumb
        items={[
          { href: '/dashboard', label: 'Dashboard Toko', icon: <Store className="w-4 h-4 mr-1" /> },
          { label: 'Edit Profil' },
        ]}
      />

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <PageHeader
          title="Edit Profil Toko"
          subtitle="Perbarui informasi dan lokasi toko Anda"
          icon={<User className="w-8 h-8 text-green-600" />}
        />

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* Avatar */}
          <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                {avatarUrl && !imageError ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div
                    className={`w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-4xl shadow-lg`}
                  >
                    {initials}
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 cursor-pointer transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" /> Informasi Pribadi
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Nama Lengkap"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
                <FormInput
                  label="Nama Toko"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Masukkan nama toko"
                />
              </div>

              <FormSelect
                label="Dusun"
                value={dusunId || ''}
                onChange={(value: string) => setDusunId(value)}
                options={[
                  { value: '', label: 'Pilih Dusun' },
                  ...dusunList.map((d) => ({ value: d.id, label: d.name })),
                ]}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" /> Informasi Toko
              </h3>
              <FormTextarea
                label="Deskripsi Toko"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                placeholder="Ceritakan tentang toko Anda..."
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" /> Kontak
              </h3>
              <FormInput
                label="Nomor WhatsApp"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" /> Lokasi Toko
              </h3>

              <StoreMap
                latitude={latitude || undefined}
                longitude={longitude || undefined}
                onLocationChange={(lat, lng) => {
                  setLatitude(lat)
                  setLongitude(lng)
                }}
              />

              {latitude && longitude ? (
                <p className="mt-4 text-sm text-green-700">
                  ✅ Lokasi tersimpan ({latitude.toFixed(6)}, {longitude.toFixed(6)})
                </p>
              ) : (
                <p className="mt-4 text-sm text-yellow-700">⚠️ Lokasi belum diset</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl font-medium">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl font-medium">
              ✅ {success}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="flex-1 sm:flex-initial px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-center transition-all"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 font-semibold shadow-lg transition-all"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
