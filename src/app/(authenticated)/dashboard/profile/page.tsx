'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
  Loader2,
  Upload,
  User,
  MapPin,
  Phone,
  FileText,
  Camera,
  Image as ImageIcon,
  ArrowLeft,
  Store,
} from 'lucide-react'
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

// === Utilitas ===
const getInitials = (name: string) => {
  if (!name) return '?'
  const words = name.trim().split(' ')
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
  ]
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[index % colors.length]
}

export default function EditProfilePage() {
  const [fullName, setFullName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storeDescription, setStoreDescription] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [dusunId, setDusunId] = useState<string | null>(null)
  const [dusunList, setDusunList] = useState<{ id: string; name: string }[]>([])

  const [uploading, setUploading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  // === Load Data Awal ===
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)
      const { data: dusunData } = await supabase.from('dusun').select('id, name').order('name')
      if (dusunData) setDusunList(dusunData)

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        setFullName(profile.full_name || '')
        setStoreName(profile.store_name || '')
        setStoreDescription(profile.store_description || '')
        setWhatsappNumber(profile.whatsapp_number || '')
        setAvatarUrl(profile.avatar_url || null)
        setCoverImageUrl(profile.cover_image_url || null)
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

  // === Upload Avatar ===
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)
      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
      setSuccess('Foto profil berhasil diunggah!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError('Gagal mengunggah foto profil')
    } finally {
      setUploading(false)
    }
  }

  // === Upload Cover ===
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB')
        return
      }
      setUploadingCover(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `cover-${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      const { error: uploadError } = await supabase.storage.from('cover-images').upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('cover-images').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      const { error: updateError } = await supabase.from('profiles').update({ cover_image_url: publicUrl }).eq('id', userId)
      if (updateError) throw updateError

      setCoverImageUrl(publicUrl)
      setSuccess('Cover image berhasil diunggah!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError('Gagal mengunggah cover image')
    } finally {
      setUploadingCover(false)
    }
  }

  // === Submit ===
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
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
      setError('Terjadi kesalahan saat mengupdate profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-600">Memuat data profil...</div>
  }

  const initials = getInitials(storeName || fullName)
  const avatarColor = getAvatarColor(storeName || fullName || 'User')

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Cover Section */}
      <div className="relative">
        <div className="h-48 sm:h-64 w-full overflow-hidden bg-gray-100">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => document.getElementById('cover-upload')?.click()}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-gray-500 cursor-pointer"
              onClick={() => document.getElementById('cover-upload')?.click()}
            >
              <ImageIcon className="w-8 h-8 mr-2" /> Klik untuk tambahkan cover
            </div>
          )}
          <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          <button
            type="button"
            className="absolute bottom-3 right-3 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg"
            onClick={() => document.getElementById('cover-upload')?.click()}
          >
            {uploadingCover ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
          </button>
        </div>

        {/* Avatar */}
        <div className="absolute left-1/2 sm:left-16 -bottom-16 transform -translate-x-1/2 sm:translate-x-0">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
            {avatarUrl && !imageError ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full ${avatarColor} border-4 border-white flex items-center justify-center text-white font-bold text-4xl shadow-lg`}
              >
                {initials}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-green-600 text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition">
              <Camera className="w-5 h-5" />
            </div>
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto mt-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-3xl font-bold text-gray-900">{storeName || 'Nama Toko'}</h1>
          <p className="text-gray-600">{fullName || 'Nama Pemilik'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput label="Nama Lengkap" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <FormInput label="Nama Toko" required value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <FormSelect
            label="Dusun"
            value={dusunId || ''}
            onChange={(val: string) => setDusunId(val)}
            options={[{ value: '', label: 'Pilih Dusun' }, ...dusunList.map((d) => ({ value: d.id, label: d.name }))]}
          />

          <FormTextarea
            label="Deskripsi Toko"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            placeholder="Ceritakan tentang toko Anda..."
          />

          <FormInput
            label="Nomor WhatsApp"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder=""
          />

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
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
              <p className="mt-3 text-sm text-green-700">
                ✅ Lokasi tersimpan ({latitude.toFixed(6)}, {longitude.toFixed(6)})
              </p>
            ) : (
              <p className="mt-3 text-sm text-yellow-700">⚠️ Lokasi belum diset</p>
            )}
          </div>

          {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl">❌ {error}</div>}
          {success && <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl">✅ {success}</div>}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="flex-1 sm:flex-initial px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-center transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-70 font-semibold shadow-lg transition"
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
