'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${searchQuery}%`)
        .limit(5);

      if (data && data.length > 0) {
        setSearchResults(data.map((p) => ({ ...p, isSuggestion: false })));
      } else {
        const { data: suggestion } = await supabase
          .from('products')
          .select('id, name')
          .ilike('name', `%${searchQuery.slice(0, 3)}%`)
          .limit(3);

        setSearchResults(
          suggestion?.length
            ? suggestion.map((s) => ({ ...s, isSuggestion: true }))
            : []
        );
      }
    };

    fetchProducts();
  }, [searchQuery, supabase]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative w-full max-w-[220px] sm:max-w-[260px]">
      {/* Input search */}
      <input
        type="text"
        placeholder="Cari produk..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchSubmit}
        className="pl-8 pr-3 py-2 w-full rounded-lg border border-gray-200 dark:border-zinc-700 
                   bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 
                   placeholder:text-gray-400 dark:placeholder:text-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-purple-500 
                   shadow-sm transition-all text-sm"
      />

      {/* Icon search */}
      <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-300" />

      {/* Dropdown hasil pencarian */}
      {searchQuery && searchResults.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-full rounded-lg border border-gray-200 dark:border-zinc-700 
                        bg-white dark:bg-zinc-900 shadow-lg overflow-hidden z-50 transition-all text-sm">
          {searchResults.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              onClick={() => setSearchQuery('')}
              className={`block px-3 py-2 
                          hover:bg-gray-50 dark:hover:bg-zinc-800 
                          text-gray-700 dark:text-gray-200 
                          ${
                            p.isSuggestion
                              ? 'italic text-gray-500 dark:text-gray-400'
                              : ''
                          }`}
            >
              {p.isSuggestion
                ? `Apakah yang kamu maksud: ${p.name}?`
                : p.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
