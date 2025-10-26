'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/PublicNavbar'
import Footer from '@/components/Footer'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
    if (mobileMenuOpen) setMobileMenuOpen(false)
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (sidebarOpen) setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-neutral-950">
      {/* Sidebar (hanya di mobile) */}
      <div className="lg:hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          collapsed={false}
          setCollapsed={() => {}}
        />
      </div>

      {/* Navbar */}
      <div className="flex-shrink-0 sticky top-0 z-40">
        <Navbar
          onSidebarToggle={handleSidebarToggle}
          isSidebarOpen={sidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
      </div>

      {/* Konten Utama */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlay Sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 pointer-events-auto"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Overlay Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 pointer-events-auto"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
