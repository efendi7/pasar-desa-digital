'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { motion } from 'framer-motion';
import { Shield, X, Menu } from 'lucide-react';
import Logo from './Logo';
import DesktopNavLinks from './DesktopNavLinks';
import CategoryDropdown from './CategoryDropdown';
import ProfileDropdown from './ProfileDropdown';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null); // Explicitly type as non-nullable
  const { isAdmin } = useAdmin();
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsCatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function checkUser() {
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
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = '/';
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg'
          : 'bg-white/80 backdrop-blur-2xl shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Logo />
          <div className="hidden lg:flex items-center gap-2">
            <DesktopNavLinks />
            <CategoryDropdown isCatOpen={isCatOpen} setIsCatOpen={setIsCatOpen} dropdownRef={dropdownRef} />
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname?.startsWith('/admin')
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
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
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
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
        />
      </div>
    </nav>
  );
}