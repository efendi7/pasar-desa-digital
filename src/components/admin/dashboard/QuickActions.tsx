'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Package, FolderTree, Menu, X } from 'lucide-react';

interface QuickActionsProps {
  showQuickActions: boolean;
  setShowQuickActions: (show: boolean) => void;
}

const quickActionsData = [
  {
    icon: Users,
    label: 'Kelola Users',
    description: 'Lihat dan kelola semua pengguna',
    color: 'text-blue-600',
    route: '/admin/users',
  },
  {
    icon: Package,
    label: 'Kelola Produk',
    description: 'Moderasi dan edit produk',
    color: 'text-green-600',
    route: '/admin/products',
  },
  {
    icon: FolderTree,
    label: 'Kelola Kategori',
    description: 'Tambah atau edit kategori',
    color: 'text-purple-600',
    route: '/admin/categories',
  },
];

export default function QuickActions({ showQuickActions, setShowQuickActions }: QuickActionsProps) {
  const router = useRouter();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="hidden md:block bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActionsData.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => router.push(action.route)}
                className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all group"
              >
                <Icon className={`w-6 h-6 ${action.color} mb-2 group-hover:scale-110 transition-transform`} />
                <div className="text-lg font-semibold text-gray-900">{action.label}</div>
                <div className="text-sm text-gray-600">{action.description}</div>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all"
        >
          {showQuickActions ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {showQuickActions && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickActions(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="md:hidden fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{ width: 'calc(100vw - 3rem)', maxWidth: '320px' }}
          >
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-green-200">
              <h3 className="font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-2">
              {quickActionsData.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      router.push(action.route);
                      setShowQuickActions(false);
                    }}
                    className="w-full p-4 flex items-start gap-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="flex-shrink-0">
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
    </>
  );
}