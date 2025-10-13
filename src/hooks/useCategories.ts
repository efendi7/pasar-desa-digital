import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Category } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClient();

  const loadCategories = useCallback(async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
      console.error('Error loading categories:', error);
      return;
    }
    setCategories(data || []);
  }, [supabase]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, refetchCategories: loadCategories };
}