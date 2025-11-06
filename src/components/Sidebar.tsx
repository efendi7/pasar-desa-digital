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
  const { isAdmin } = useAdmin()

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
    { href: '/admin/profiles', label: 'Persetujuan Pengguna', icon: User2 },
    { href: '/admin/users', label: 'Kelola Pengguna', icon: Users },
  ]

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 shadow-lg z-50 transition-all duration-300
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      ${collapsed ? 'lg:w-20' : 'lg:w-64'}
      lg:translate-x-0`}
    >
      <div className="relative h-full flex flex-col">
        {/* Tombol Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Header Logo */}
        <div
          className={`flex items-center h-16 lg:h-20 border-b border-gray-200 dark:border-neutral-800 px-4 transition-all duration-300 overflow-hidden ${
            collapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
            {collapsed ? (
              <Logo
                variant="vertical"
                size="sm"
                showSubtitle={false}
                className="scale-110"
              />
            ) : (
              <Logo variant="horizontal" size="md" />
            )}
          </Link>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {/* Menu Umum */}
          <ul className="space-y-2 mb-6">
            {!collapsed && (
              <li className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Umum
              </li>
            )}
            {generalMenu.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                      active
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        active
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    />
                    {!collapsed && <span className="font-medium">{label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Menu Dashboard */}
          <ul className="hidden lg:block space-y-2">
            {!collapsed && (
              <li className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Dashboard
              </li>
            )}
            {baseMenu.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                      active
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        active
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    />
                    {!collapsed && <span className="font-medium">{label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Menu Admin */}
          {isAdmin && (
            <ul className="hidden lg:block space-y-2 mt-6">
              {!collapsed && (
                <li className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Menu Admin
                </li>
              )}
              {adminMenu.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                        active
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${
                          active
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      />
                      {!collapsed && <span className="font-medium">{label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </nav>
      </div>
    </aside>
  )
}
