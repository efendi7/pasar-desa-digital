export type FilterStatus = 'all' | 'active' | 'inactive';
export type SortByType = 'newest' | 'oldest' | 'most_views' | 'least_views';

export interface Category {
  id: string;
  name: string;
}

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
  categories: { name: string } | null;
}