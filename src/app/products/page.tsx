import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    category?: string; 
    search?: string;
  }>;
}

async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const supabase = createClient();
  const ITEMS_PER_PAGE = 12;

  const page = parseInt(params.page || '1', 10);
  const category = params.category || 'all';
  const search = params.search || '';

  // Hitung range untuk pagination
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Query dasar
  let query = supabase
    .from("products")
    .select("*, profiles!inner(id, store_name), categories(name, slug)", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to); // ✅ batasi hasil sesuai halaman

  // Filter kategori
  if (category !== "all") {
    query = query.eq("categories.slug", category);
  }

  // Filter pencarian (jika panjang >= 3)
  if (search.trim().length >= 3) {
    const term = `%${search.trim()}%`;
    query = query.or(`name.ilike.${term},profiles.store_name.ilike.${term}`);
  }

  const { data: products, count } = await query;

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ProductsClient
        initialProducts={products || []}
        initialCategories={categories || []}
        initialPage={page}
        initialCategory={category}
        initialSearch={search}
        totalCount={count || 0} // ✅ kirim total untuk pagination
      />
    </Suspense>
  );
}

export default ProductsPage;
