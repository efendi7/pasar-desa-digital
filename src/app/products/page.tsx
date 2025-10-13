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
  // Await searchParams terlebih dahulu
  const params = await searchParams;
  
  const supabase = createClient();

  // Fetch products dan categories secara paralel
  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from("products")
      .select("*, profiles!inner(id, store_name), categories(name, slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    
    supabase
      .from("categories")
      .select("*")
      .order("name")
  ]);

  const page = parseInt(params.page || '1', 10);
  const category = params.category || 'all';
  const search = params.search || '';

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ProductsClient
        initialProducts={productsResult.data || []}
        initialCategories={categoriesResult.data || []}
        initialPage={page}
        initialCategory={category}
        initialSearch={search}
      />
    </Suspense>
  );
}

export default ProductsPage;