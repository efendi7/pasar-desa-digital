import { RefObject } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Coffee,
  Palette,
  Shirt,
  Wheat,
  Package,
  ChevronDown,
} from 'lucide-react';

interface CategoryDropdownProps {
  isCatOpen: boolean;
  setIsCatOpen: (isOpen: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
}

export default function CategoryDropdown({ isCatOpen, setIsCatOpen, dropdownRef }: CategoryDropdownProps) {
  const categories = [
    { name: 'Makanan', slug: 'makanan', icon: UtensilsCrossed },
    { name: 'Minuman', slug: 'minuman', icon: Coffee },
    { name: 'Kerajinan', slug: 'kerajinan', icon: Palette },
    { name: 'Pakaian', slug: 'pakaian', icon: Shirt },
    { name: 'Pertanian', slug: 'pertanian', icon: Wheat },
    { name: 'Lainnya', slug: 'lainnya', icon: Package },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsCatOpen(!isCatOpen)}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all"
      >
        Kategori
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isCatOpen ? 'rotate-180 text-green-600' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isCatOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsCatOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}