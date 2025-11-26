'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdmin } from '@/hooks/useAdmin'
import {
  LayoutDashboard,
  Package,
  Plus,
  User2,
  Users,
  Store,
  Home,
  ClipboardList,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Logo from '@/components/Logo'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname()
  const { isAdmin, loading } = useAdmin() // ← sesuai nama di hook kamu

  const generalMenu = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/products', label: 'Produk', icon: Package },
    { href: '/store', label: 'Toko', icon: Store },
  ]

  const baseMenu = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/products', label: 'Produk Saya', icon: Package },
    { href: '/dashboard/products/add', label: 'Tambah Produk', icon: Plus },
    { href: '/dashboard/profile', label: 'Toko Saya', icon: User2 },
  ]

  const adminMenu = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: ShieldCheck },
    { href: '/admin/products', label: 'Kelola Produk', icon: ClipboardList },
    { href: '/admin/users', label: 'Kelola Pengguna', icon: Users },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // LOADING STATE – selama menunggu Supabase
  if (loading) {
    return (
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-${collapsed ? '20' : '64'} bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 -translate-x-full lg:translate-x-0 transition-all duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Skeleton */}
          <div className="flex items-center h-16 lg:h-20 px-6 border-b border-gray-200 dark:border-neutral-800">
            <div className="h-10 w-36 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>

          {/* Menu Skeleton */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            <div className="space-y-4">
              <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-3 py-3">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    )
  }

  // SIDEBAR SETELAH LOADING SELESAI
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 shadow-lg transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'lg:w-20' : 'lg:w-64'}
        lg:translate-x-0`}
    >
      <div className="relative flex flex-col h-full">
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-md hover:bg-gray-100 dark:hover:bg-neutral-700 z-10"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Logo */}
        <div
          className={`flex items-center h-16 lg:h-20 border-b border-gray-200 dark:border-neutral-800 px-4 overflow-hidden transition-all ${
            collapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <Link
            href={isAdmin ? '/admin/dashboard' : '/dashboard'}
            onClick={() => setSidebarOpen(false)}
          >
            {collapsed ? (
              <Logo variant="vertical" size="sm" showSubtitle={false} className="scale-110" />
            ) : (
              <Logo variant="horizontal" size="md" />
            )}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {/* MENU UMUM – selalu tampil (mobile + desktop) */}
          <ul className="mb-6 space-y-2">
            {!collapsed && (
              <li className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Umum
              </li>
            )}
            {generalMenu.map(({ href, label, icon: Icon }) => {
              const active = isActive(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      active
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    />
                    {!collapsed && <span className="font-medium">{label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* MENU KHUSUS – Hanya muncul di desktop */}
          <div className="hidden lg:block space-y-6">
            {/* User Biasa */}
            {!isAdmin && (
              <ul className="space-y-2">
                {!collapsed && (
                  <li className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Dashboard
                  </li>
                )}
                {baseMenu.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                          active
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        />
                        {!collapsed && <span className="font-medium">{label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* Admin */}
            {isAdmin && (
              <ul className="space-y-2">
                {!collapsed && (
                  <li className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Menu Admin
                  </li>
                )}
                {adminMenu.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                          active
                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        />
                        {!collapsed && <span className="font-medium">{label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </aside>
  )
}