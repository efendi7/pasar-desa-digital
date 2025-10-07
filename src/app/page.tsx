// src/app/page.tsx
import { createClient } from "@/utils/supabase/server";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { CTASection } from "@/components/home/CTASection";
import { getStats } from "@/lib/getStats";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  views: number;
  profiles: { store_name: string } | null;
  categories: { name: string } | null;
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
}

export default async function IndexPage() {
  const supabase = createClient();
  const statsData = await getStats(); // ✅ ubah nama variabel agar tidak bentrok

  // Jalankan query paralel untuk efisiensi
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
    <div className="min-h-screen">
      {/* ✅ kirim statsData ke HeroSection */}
      <HeroSection stats={statsData} />

      <div className="container mx-auto px-4 py-8 space-y-16">
        <HowItWorks />
        <CategoriesSection categories={categories} />
        <ProductsSection products={products as any} />
      </div>

      <CTASection />
    </div>
  );
}
