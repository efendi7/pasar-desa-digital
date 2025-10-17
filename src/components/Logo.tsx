import Link from 'next/link';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-md"
      >
        <Store className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.div>
      <div className="hidden sm:block">
        <div className="text-xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-semibold">
          Kebumify
        </div>
        <div className="text-xs text-gray-500 font-medium tracking-wide">
          Etalase Digital UMKM Desa
        </div>
      </div>
      <div className="sm:hidden">
        <div className="text-lg bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-semibold">
          Kebumify
        </div>
      </div>
    </Link>
  );
}