'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { X, Menu, Sun, Moon, Bell } from 'lucide-react'
import ProfileDropdown from './ProfileDropdown'
import MobileMenu from './MobileMenu'
import SearchBar from './SearchBar'
import { useAdmin } from '@/hooks/useAdmin' // ✅ Tambahkan import useAdmin

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const supabase = createClient()
  const { isAdmin } = useAdmin() // ✅ cek apakah user admin

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('store_name, full_name, avatar_url')
          .eq('id', user.id)
          .single()

        setProfile(profileData)
      }
    }
    checkUser()
  }, [supabase])

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

  const isActive = (path: string) =>
    pathname === path
      ? 'text-green-600 font-semibold'
      : 'text-gray-700 dark:text-gray-300 hover:text-green-500'

  return (
    <nav className="sticky top-0 z-40 transition-all duration-300 bg-white/95 backdrop-blur-xl shadow-md dark:bg-neutral-900/95 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* === KIRI: Sidebar toggle + Navigasi === */}
          <div className="flex items-center gap-4">
            {/* Tombol Sidebar (mobile) */}
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

            {/* Navigasi utama (desktop) */}
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/" className={isActive('/')}>
                Home
              </Link>
              <Link href="/dashboard" className={isActive('/dashboard')}>
                Dashboard
              </Link>
              <Link href="/products" className={isActive('/products')}>
                Produk
              </Link>
              <Link href="/store" className={isActive('/store')}>
                Toko
              </Link>

              {/* ✅ Tambahkan Admin Panel di kanan navigasi toko */}
              {isAdmin && (
                <Link href="/admin/dashboard" className={isActive('/admin')}>
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* === KANAN: SearchBar, Notifikasi, Mode, Profile, Hamburger === */}
          <div className="flex items-center gap-3">
            {/* SearchBar (desktop) */}
            <div className="hidden sm:block">
              <SearchBar className="w-48 sm:w-56" />
            </div>

            {/* Notifikasi */}
            <div className="relative hidden sm:flex">
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
            </div>

            {/* Tombol Dark Mode */}
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

            {/* Profile Dropdown */}
            <ProfileDropdown
              user={user}
              profile={profile}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              handleLogout={handleLogout}
              dropdownRef={dropdownRef}
            />

            {/* Hamburger kanan untuk Mobile Menu */}
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

        {/* === Mobile Menu === */}
        <MobileMenu
          isMenuOpen={mobileMenuOpen}
          setIsMenuOpen={onMobileMenuToggle}
          user={user}
          profile={profile}
          isAdmin={isAdmin}
          handleLogout={handleLogout}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
      </div>
    </nav>
  )
}
