'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { motion } from 'framer-motion';
import { Shield, X, Menu, Sun, Moon, Bell } from 'lucide-react';
import Logo from './Logo';
import DesktopNavLinks from './DesktopNavLinks';
import ProfileDropdown from './ProfileDropdown';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAdmin();
  const pathname = usePathname();
  const supabase = createClient();

  // ===== USER CHECK =====
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('store_name, avatar_url')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
    };
    checkUser();
  }, [supabase]);

  // ===== SCROLL EFFECT =====
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ===== CLICK OUTSIDE DROPDOWN =====
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===== DARK MODE =====
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // ===== LOGOUT =====
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = '/';
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg dark:bg-gray-900/95'
          : 'bg-white/80 backdrop-blur-2xl shadow-md dark:bg-gray-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Logo />

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-4">
            <DesktopNavLinks pathname={pathname} />

            {/* Refactored Search */}
            <SearchBar />

            {/* Admin Panel */}
{isAdmin && (
  <Link
    href="/admin/dashboard"
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
      pathname?.startsWith('/admin')
        ? 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900'
        : 'text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900'
    }`}
  >
    <Shield className="w-4 h-4 flex-shrink-0" />
    <span className="whitespace-nowrap">Admin Panel</span>
  </Link>
)}

          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <div className="relative hidden lg:flex">
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
            </div>

           <button
  onClick={toggleDarkMode}
  className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-zinc-700 
             bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 
             transition-all"
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
              isAdmin={isAdmin}
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
            </motion.button>
          </div>
        </div>
<MobileMenu
  isMenuOpen={isMenuOpen}
  setIsMenuOpen={setIsMenuOpen}
  user={user}
  profile={profile}
  isAdmin={isAdmin}
  handleLogout={handleLogout}
  toggleDarkMode={toggleDarkMode}
  isDarkMode={isDarkMode}
/>

      </div>
    </nav>
  );
}
