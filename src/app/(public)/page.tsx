// src/app/page.tsx

import { createClient } from "@/utils/supabase/server";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { CTASection } from "@/components/home/CTASection";
import { getStats } from "@/lib/getStats";
import type { Product } from "@/types";

export const revalidate = 0;

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
        id, name, description, price, image_url, views, 
        created_at, updated_at, owner_id, category_id, dusun_id, is_active,
        profiles ( store_name ),
        categories ( name ),
        dusun ( name )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10),

    supabase.from("categories").select("id, name, slug").order("name"),
  ]);

  // ✅ Normalize data: Convert arrays to single objects
  const products: Product[] = (productsResult.data || []).map((p: any) => ({
    ...p,
    categories: Array.isArray(p.categories) ? p.categories[0] : p.categories,
    dusun: Array.isArray(p.dusun) ? p.dusun[0] : p.dusun,
    profiles: Array.isArray(p.profiles) ? p.profiles[0] : p.profiles,
  }));

  const categories = categoriesResult.data || [];

  // ✅ Debug
  console.log("Normalized product:", products[0]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <HeroSection stats={statsData} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-16 max-w-[1920px] mx-auto">
        <HowItWorks />
        <CategoriesSection categories={categories} />
        <ProductsSection products={products} />
      </div>

      <CTASection />
    </div>
  );
}