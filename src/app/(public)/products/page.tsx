import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    category?: string; 
    search?: string;
    dusun?: string; // 👈 1. Tambah parameter dusun
  }>;
}

async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const supabase = createClient();
  const ITEMS_PER_PAGE = 12;

  const page = parseInt(params.page || '1', 10);
  const category = params.category || 'all';
  const search = params.search || '';
  const dusun = params.dusun || 'all'; // 👈 2. Baca parameter dusun dari URL

  // Hitung range untuk pagination
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Query dasar
  let query = supabase
    .from("products")
    // 👈 3. Update select untuk mengambil data dusun melalui profiles
    .select("*, categories(name, slug), profiles!inner(store_name, dusun(name, slug))", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  // Filter kategori
  if (category !== "all") {
    query = query.eq("categories.slug", category);
  }

  // 👈 4. Tambah filter dusun
  if (dusun !== "all") {
    // Filter berdasarkan slug dusun yang ada di dalam tabel profiles
    query = query.eq("profiles.dusun.slug", dusun);
  }

  // Filter pencarian (jika panjang >= 3)
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
    
  // 👈 5. Ambil daftar semua dusun untuk dropdown filter
  const { data: dusuns } = await supabase
    .from("dusun")
    .select("*")
    .order("name");

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ProductsClient
        initialProducts={products || []}
        initialCategories={categories || []}
        initialDusuns={dusuns || []} // 👈 6. Kirim daftar dusun ke client
        initialPage={page}
        initialCategory={category}
        initialDusun={dusun} // 👈 6. Kirim dusun yang aktif ke client
        initialSearch={search}
        totalCount={count || 0}
      />
    </Suspense>
  );
}

export default ProductsPage;