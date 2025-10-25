'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/PublicNavbar'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Toggle sidebar (hanya aktif di mobile)
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
    if (mobileMenuOpen) setMobileMenuOpen(false)
  }

  // Toggle mobile menu (hanya aktif di mobile)
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (sidebarOpen) setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* === Sidebar: tampil hanya di mobile === */}
      <div className="lg:hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          collapsed={false}
          setCollapsed={() => {}}
        />
      </div>

      {/* === Main Container (tanpa margin kiri di desktop) === */}
      <div className="flex flex-col min-h-screen transition-all duration-300">
        {/* Navbar */}
        <div className="flex-shrink-0 sticky top-0 z-40">
          <Navbar
            onSidebarToggle={handleSidebarToggle}
            isSidebarOpen={sidebarOpen}
            mobileMenuOpen={mobileMenuOpen}
            onMobileMenuToggle={handleMobileMenuToggle}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>

      {/* Overlay untuk mobile sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 pointer-events-auto"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Overlay untuk mobile menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 pointer-events-auto"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
