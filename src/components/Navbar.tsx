'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { Bell, Menu, X, Sun, Moon } from 'lucide-react'
import ProfileDropdown from './ProfileDropdown'
import MobileMenu from './MobileMenu'
import SearchBar from './SearchBar'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

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
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // === Fetch user & profile ===
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('store_name, full_name, avatar_url, role')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      }
    }
    checkUser()
  }, [supabase])

  // === Fetch Unread Notifications (Admin Only) ===
  useEffect(() => {
    if (!user || profile?.role !== 'admin') return

    const fetchUnreadCount = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('admin_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setUnreadCount(data.length)
        setNotifications(data)
      }
    }

    fetchUnreadCount()
  }, [user, profile, supabase])

  // === Listen Realtime for New Notifications ===
  useEffect(() => {
    if (!user || profile?.role !== 'admin') return

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `admin_id=eq.${user.id}`
        },
        (payload) => {
          const newNotif = payload.new
          setNotifications(prev => [newNotif, ...prev])
          setUnreadCount(prev => prev + 1)
          toast.success(`🆕 ${newNotif.message}`, {
            duration: 5000,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, profile, supabase])

  // === Mark All as Read ===
  const markAllAsRead = async () => {
    if (!user) return
    
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('admin_id', user.id)
      .eq('is_read', false)

    setUnreadCount(0)
    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true }))
    )
  }

  // === Click Outside Handlers ===
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
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
          </div>

          {/* === KANAN: Search, Notif, Mode, Profile === */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <SearchBar className="w-48 sm:w-56" />
            </div>

            {/* === NOTIFICATION BELL WITH BADGE (Admin Only) === */}
            {profile?.role === 'admin' && (
              <div className="relative" ref={notificationRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  
                  {/* Badge Merah dengan Angka */}
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-neutral-900"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Dropdown Notifications */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Notifikasi
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                          >
                            Tandai semua dibaca
                          </button>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Tidak ada notifikasi</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                !notif.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <span className="text-green-600 dark:text-green-400 text-lg">
                                      👤
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 dark:text-white">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(notif.created_at).toLocaleString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                {!notif.is_read && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

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
          isAdmin={profile?.role === 'admin'}
          handleLogout={handleLogout}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
      </div>
    </nav>
  )
}