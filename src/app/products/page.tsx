import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { createClient } from "@/utils/supabase/server";

async function ProductsPage() {
  const supabase = createClient();

  const { data: productsData } = await supabase
    .from("products")
    .select("*, profiles!inner(store_name), categories(name, slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClient
        initialProducts={productsData || []}
        initialCategories={categoriesData || []}
        initialPage={1}
        initialCategory="all"
        initialSearch=""
      />
    </Suspense>
  );
}

export default ProductsPage;
