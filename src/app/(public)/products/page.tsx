import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    category?: string; 
    search?: string;
    dusun?: string;
  }>;
}

async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const supabase = createClient();
  const ITEMS_PER_PAGE = 12;

  const page = parseInt(params.page || '1', 10);
  const category = params.category || 'all';
  const search = params.search || '';
  const dusun = params.dusun || 'all';

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Query dasar - join dusun dari profiles
  let query = supabase
    .from("products")
    .select(`
      *, 
      categories(name, slug), 
      profiles!inner(store_name, dusun(name, slug))
    `, { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  // Filter kategori
  if (category !== "all") {
    query = query.eq("categories.slug", category);
  }

  // Filter berdasarkan dusun penjual (dari profiles.dusun_id)
  if (dusun !== "all") {
    query = query.eq("profiles.dusun.slug", dusun);
  }

  // Filter pencarian
  if (search.trim().length >= 3) {
    const term = `%${search.trim()}%`;
    query = query.or(`name.ilike.${term},profiles.store_name.ilike.${term}`);
  }

  const { data: products, count } = await query;

  // Ambil daftar kategori
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");
    
  // Ambil daftar semua dusun untuk dropdown filter
  const { data: dusuns } = await supabase
    .from("dusun")
    .select("*")
    .order("name");

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ProductsClient
        initialProducts={products || []}
        initialCategories={categories || []}
        initialDusuns={dusuns || []}
        initialPage={page}
        initialCategory={category}
        initialDusun={dusun}
        initialSearch={search}
        totalCount={count || 0}
      />
    </Suspense>
  );
}

export default ProductsPage;