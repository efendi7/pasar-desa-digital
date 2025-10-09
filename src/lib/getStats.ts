// src/lib/getStats.js

import { createClient } from "@/utils/supabase/server";

export async function getStats() {
  const supabase = createClient();

  const [umkmRes, productRes, viewsRes, trendRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("products").select("views"),
    supabase.rpc("get_trend_percentage_weekly"),
  ]);

  // --- LANGKAH DEBUGGING ---
  // Log ini akan menunjukkan isi sebenarnya dari respons RPC di terminal server Anda
  console.log("Raw Response from RPC (trendRes):", JSON.stringify(trendRes, null, 2));
  // -------------------------

  const totalViews =
    viewsRes.data?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;

  return {
    umkm: umkmRes.count || 0,
    products: productRes.count || 0,
    views: totalViews,
    trend: trendRes.data || 0,
  };
}