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
          suggestion?.length ? suggestion.map((s) => ({ ...s, isSuggestion: true })) : []
        );
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Cari produk..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchSubmit}
        className="pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-300" />

      {searchQuery && searchResults.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
          {searchResults.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className={`block px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 ${
                p.isSuggestion ? 'italic text-gray-500 dark:text-gray-300' : ''
              }`}
              onClick={() => setSearchQuery('')}
            >
              {p.isSuggestion ? `Apakah yang kamu maksud: ${p.name}?` : p.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
