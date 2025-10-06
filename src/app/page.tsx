import { createClient } from "@/utils/supabase/server";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { CTASection } from "@/components/home/CTASection";

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

  // Parallel data fetching untuk performa optimal
  const [
    productsResult,
    categoriesResult,
    umkmCountResult,
    productCountResult,
    viewsResult,
  ] = await Promise.all([
    // Query 1: Produk dengan relasi
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

    // Query 2: Semua kategori
    supabase.from("categories").select("id, name, slug").order("name"),

    // Query 3: Total UMKM aktif
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),

    // Query 4: Total produk aktif
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),

    // Query 5: Views untuk dijumlahkan
    supabase.from("products").select("views").eq("is_active", true),
  ]);

  // Process data
  const products = productsResult.data || [];
  const categories = categoriesResult.data || [];
  
  const totalViews = viewsResult.data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

  const stats: Stats = {
    umkm: umkmCountResult.count || 0,
    products: productCountResult.count || 0,
    views: totalViews,
  };

  return (
    <div className="min-h-screen">
      {/* HeroSection sekarang menerima stats sebagai props */}
      <HeroSection stats={stats} />
      
      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* StatsSection DIHAPUS - sudah ada di Hero */}
        <HowItWorks />
        <CategoriesSection categories={categories} />
        <ProductsSection products={products as any} />
      </div>
      
      <CTASection />
    </div>
  );
}