// types/index.ts
export type FilterStatus = 'all' | 'active' | 'inactive';
export type SortByType = 'newest' | 'oldest' | 'most_views' | 'least_views';

export interface Category {
  id: string;
  name: string;
}

// ✅ TAMBAHKAN interface Dusun
export interface Dusun {
  id: string;
  name: string;
}

// ✅ UPDATE Product interface dengan dusun
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  is_active: boolean;
  views?: number;
  created_at: string;
  owner_id: string;
  category_id: string;
  dusun_id?: string; // ✅ Tambahkan dusun_id
  
  // Relations
  categories: { name: string } | null;
  dusun?: { name: string } | null; // ✅ Tambahkan relasi dusun
  profiles?: { store_name: string } | null; // Optional, tapi bagus ditambahkan
}