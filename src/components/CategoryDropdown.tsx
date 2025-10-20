'use client';

import { RefObject, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Shirt,
  Palette,
  Wheat,
  Laptop,
  Package,
  Dumbbell,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface CategoryDropdownProps {
  isCatOpen: boolean;
  setIsCatOpen: (isOpen: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Icon mapping
const categoryIcons: Record<string, any> = {
  'makanan-minuman': UtensilsCrossed,
  'fashion': Shirt,
  'kerajinan': Palette,
  'pertanian': Wheat,
  'elektronik': Laptop,
  'olahraga': Dumbbell,
  'kecantikan': Sparkles,
  'lainnya': Package,
};

export default function CategoryDropdown({ isCatOpen, setIsCatOpen, dropdownRef }: CategoryDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // Fetch categories from database
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }

        setCategories(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Toggle dropdown
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggling dropdown from', isCatOpen, 'to', !isCatOpen);
    setIsCatOpen(!isCatOpen);
  };

  // Handle category navigation
  const handleCategoryClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navigating to category:', slug);
    
    // Close dropdown immediately
    setIsCatOpen(false);
    
    // Navigate to category page
    router.push(`/category/${slug}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all"
        type="button"
        aria-expanded={isCatOpen}
        aria-haspopup="true"
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
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                // Loading skeleton
                <div className="p-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                      <div className="w-5 h-5 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                  ))}
                </div>
              ) : categories.length === 0 ? (
                // Empty state
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  Tidak ada kategori
                </div>
              ) : (
                // Category list
                <div className="py-1">
                  {categories.map((cat) => {
                    const Icon = categoryIcons[cat.slug] || Package;
                    return (
                      <button
                        key={cat.id}
                        onClick={(e) => handleCategoryClick(e, cat.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors group text-left"
                        type="button"
                      >
                        <Icon className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}