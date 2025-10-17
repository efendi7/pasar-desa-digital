'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Package, UserCircle2, Menu, X } from 'lucide-react';

export default function UserQuickActions() {
  const router = useRouter();
  // State untuk mengontrol menu pada tampilan mobile
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Data diperbarui dengan deskripsi dan warna ikon
  const actions = [
    {
      icon: PlusCircle,
      label: 'Tambah Produk',
      description: 'Buat produk baru di tokomu',
      color: 'text-green-600',
      href: '/dashboard/products/add',
    },
    {
      icon: Package,
      label: 'Kelola Produk',
      description: 'Lihat & edit semua produkmu',
      color: 'text-blue-600',
      href: '/dashboard/products',
    },
    {
      icon: UserCircle2,
      label: 'Edit Profil',
      description: 'Perbarui profil & info tokomu',
      color: 'text-purple-600',
      href: '/dashboard/profile',
    },
  ];

  return (
    <>
      {/* Tampilan Desktop: Meniru gaya admin */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden sm:block bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => router.push(action.href)}
                className="p-4 bg-white text-left border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all group"
              >
                <Icon className={`w-6 h-6 ${action.color} mb-2 group-hover:scale-110 transition-transform`} />
                <div className="text-lg font-semibold text-gray-900">{action.label}</div>
                <div className="text-sm text-gray-600">{action.description}</div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tampilan Mobile: FAB & Modal meniru gaya admin */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all"
        >
          {showQuickActions ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {showQuickActions && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickActions(false)}
              className="sm:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="sm:hidden fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
              style={{ width: 'calc(100vw - 3rem)', maxWidth: '320px' }}
            >
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200">
                <h3 className="font-bold text-gray-900">Aksi Cepat</h3>
              </div>
              <div className="p-2">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => {
                        router.push(action.href);
                        setShowQuickActions(false);
                      }}
                      className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="flex-shrink-0 pt-0.5">
                        <Icon className={`w-5 h-5 ${action.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 text-sm">{action.label}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{action.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}