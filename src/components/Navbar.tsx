'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { Bell, Menu, X, Sun, Moon } from 'lucide-react'
import ProfileDropdown from './ProfileDropdown'
import MobileMenu from './MobileMenu'
import SearchBar from './SearchBar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  onSidebarToggle: () => void
  isSidebarOpen: boolean
  mobileMenuOpen: boolean
  onMobileMenuToggle: () => void
}

export default function Navbar({
  onSidebarToggle,
  isSidebarOpen,
  mobileMenuOpen,
  onMobileMenuToggle,
}: NavbarProps) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true) // 👈 Tambahkan state loading
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const pathname = usePathname()
  const isAdmin = profile?.role === 'admin' // Gunakan isAdmin dari profile

  // === Fetch user & profile ===
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true) // Mulai loading
      
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      let profileData = null
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('store_name, full_name, avatar_url, role')
          .eq('id', user.id)
          .single()
        profileData = data
      }
      
      setProfile(profileData)
      setIsLoading(false) // Selesai loading
    }
    checkUser()
  }, [supabase])

  // === Listen Realtime Only for Admin ===
  useEffect(() => {
    if (!profile || profile.role !== 'admin') return // hanya admin yang bisa listen

    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        (payload) => {
          const newProfile = payload.new
          toast.success(`🆕 Pengguna baru mendaftar: ${newProfile.full_name}`)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, profile])

  // === Dropdown Click Outside ===
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    window.location.href = '/'
  }

  // Komponen Loader Profil untuk Navbar (Skeleton)
  const ProfileLoader = () => (
    <div className="flex items-center gap-3">
      {/* Skeleton untuk Dark Mode Toggle */}
      <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-700 rounded-lg animate-pulse"></div>
      {/* Skeleton untuk Avatar/Dropdown */}
      <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-700 rounded-full animate-pulse"></div>
    </div>
  )


  return (
    <nav className="sticky top-0 z-40 transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-md dark:bg-neutral-900/95 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* === KIRI: Toggle Sidebar === */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onSidebarToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </motion.button>
            {/* Jika Anda memiliki logo atau navigasi desktop di sini, tambahkan di sini */}
          </div>

          {/* === KANAN: Search, Notif, Mode, Profile === */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <SearchBar className="w-48 sm:w-56" />
            </div>

            {/* Notifikasi hanya admin, hanya ditampilkan jika TIDAK loading */}
            {!isLoading && isAdmin && (
              <div className="relative hidden sm:flex">
                <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
              </div>
            )}
            
            {/* ✅ Blokir tombol Dark Mode dan Profile saat loading */}
            {isLoading ? (
                <ProfileLoader />
            ) : (
                <>
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all"
                        aria-label="Toggle Dark Mode"
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>

                    <ProfileDropdown
                        user={user}
                        profile={profile}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        handleLogout={handleLogout}
                        dropdownRef={dropdownRef}
                    />
                </>
            )}

            {/* Mobile Menu */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>

        <MobileMenu
          isMenuOpen={mobileMenuOpen}
          setIsMenuOpen={onMobileMenuToggle}
          user={user}
          profile={profile}
          isAdmin={isAdmin}
          handleLogout={handleLogout}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          isLoading={isLoading} // 👈 Luluskan isLoading
        />
      </div>
    </nav>
  )
}