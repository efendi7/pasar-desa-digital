import { createClient } from "@/utils/supabase/server";

export async function getStats() {
  const supabase = createClient();

  // Jalankan query cepat dengan timer aman
  console.time("Waktu Query Cepat (UMKM, Produk, Views)");
  let umkmRes, productRes, viewsRes;

  try {
    [umkmRes, productRes, viewsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase.rpc("get_total_product_views"),
    ]);
  } catch (error) {
    console.error("❌ Error saat menjalankan query cepat:", error);
  } finally {
    console.timeEnd("Waktu Query Cepat (UMKM, Produk, Views)");
  }

  // Jalankan query tren yang lambat dengan timer aman
  console.time("Waktu Query Tren (LAMBAT)");
  let trendRes;
  try {
    trendRes = await supabase.rpc("get_trend_percentage_weekly");
  } catch (error) {
    console.error("❌ Error saat menjalankan query tren:", error);
  } finally {
    console.timeEnd("Waktu Query Tren (LAMBAT)");
  }

  // Pastikan nilai tidak undefined
  return {
    umkm: Number(umkmRes?.count ?? 0),
    products: Number(productRes?.count ?? 0),
    views: Number(viewsRes?.data ?? 0),
    trend: Number(trendRes?.data ?? 0),
  };
}
