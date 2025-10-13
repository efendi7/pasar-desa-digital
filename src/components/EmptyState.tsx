import Link from 'next/link';
import { Plus, Package } from 'lucide-react';

export const EmptyState = () => (
  <div className="text-center py-16">
    <div className="flex justify-center mb-6">
      <div className="p-6 bg-gray-100 rounded-full">
        <Package size={64} className="text-gray-400" />
      </div>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Produk</h2>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      Mulai tambahkan produk pertama Anda untuk ditampilkan di etalase digital
    </p>
    <Link
      href="/dashboard/products/add"
      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <Plus size={20} />
      Tambah Produk Pertama
    </Link>
  </div>
);