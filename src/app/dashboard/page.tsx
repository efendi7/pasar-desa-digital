import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const supabase = createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Fetch profile data
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch products data (termasuk kategori dan dusun)
const { data: productsData, error: productsError } = await supabase
  .from('products')
  .select(`
    *,
    categories(
      id,
      name,
      slug
    ),
    profiles(
      id,
      store_name,
      full_name,
      whatsapp_number,
      dusun:dusun_id(
        id,
        name,
        slug
      )
    )
  `)
  .eq('owner_id', user.id)
  .order('created_at', { ascending: false });

if (productsError) {
  console.error('Error fetching products:', productsError);
}

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen text-gray-600 animate-pulse">
        Memuat Dashboard...
      </div>
    }>
      <DashboardClient
        initialProfile={profileData}
        initialProducts={productsData || []}
      />
    </Suspense>
  );
}

export default DashboardPage;