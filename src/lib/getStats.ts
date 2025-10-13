import { createClient } from "@/utils/supabase/server";

export async function getStats() {
  const supabase = createClient();

  // Jalankan query yang cepat terlebih dahulu
  console.time("Waktu Query Cepat (UMKM, Produk, Views)");
  const [umkmRes, productRes, viewsRes] = await Promise.all([
    // Ini sudah efisien, tidak perlu diubah
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    // Ini juga sudah efisien, tidak perlu diubah
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    // Panggil fungsi baru yang jauh lebih cepat untuk menghitung total views
    supabase.rpc("get_total_product_views"), 
  ]);
  console.timeEnd("Waktu Query Cepat (UMKM, Produk, Views)");

  // Panggil RPC yang lambat secara terpisah untuk debugging
  console.time("Waktu Query Tren (LAMBAT)");
  const trendRes = await supabase.rpc("get_trend_percentage_weekly");
  console.timeEnd("Waktu Query Tren (LAMBAT)");

  return {
    umkm: umkmRes.count || 0,
    products: productRes.count || 0,
    views: viewsRes.data || 0, // Hasilnya sudah berupa angka total
    trend: trendRes.data || 0,
  };
}