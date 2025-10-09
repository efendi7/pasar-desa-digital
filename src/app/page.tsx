// src/app/page.tsx

import { createClient } from "@/utils/supabase/server";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { CTASection } from "@/components/home/CTASection";
import { getStats } from "@/lib/getStats";

export const revalidate = 0;

// ✅ FIX: Menyesuaikan interface agar cocok dengan data dari Supabase
export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  views: number;
  // Mengubah dari objek tunggal menjadi array objek
  profiles: { store_name: string }[] | null;
  categories: { name: string }[] | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Stats {
  umkm: number;
  products: number;
  views: number;
  trend: number;
}

export default async function IndexPage() {
  const supabase = createClient();
  const statsData = await getStats();

  console.log("Latest Server Stats Data:", statsData);

  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from("products")
      .select(`
        id, name, price, image_url, views,
        profiles ( store_name ),
        categories ( name )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8),

    supabase.from("categories").select("id, name, slug").order("name"),
  ]);

  const products = productsResult.data || [];
  const categories = categoriesResult.data || [];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <HeroSection stats={statsData} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-16 max-w-[1920px] mx-auto">
        <HowItWorks />
        <CategoriesSection categories={categories} />
        {/* Sekarang, tipe 'products' akan cocok dengan 'Product[]' */}
        <ProductsSection products={products as Product[]} />
      </div>

      <CTASection />
    </div>
  );
}