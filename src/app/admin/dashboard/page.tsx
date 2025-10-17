import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

async function AdminDashboardPage() {
  const supabase = createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  // Fetch all stats in parallel
  const [
    { count: usersCount },
    { count: productsCount },
    { count: activeCount },
    { count: categoriesCount },
    { data: productsData },
    { data: activeStoresData },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('views'),
    supabase.from('profiles').select('id').eq('is_active', true),
  ]);

  const totalViews = productsData?.reduce((sum, product) => sum + (product.views || 0), 0) || 0;

  // Calculate active stores
  let activeStoresCount = 0;
  if (activeStoresData) {
    const storesWithProducts = await Promise.all(
      activeStoresData.map(async (profile) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', profile.id);
        return count && count > 0 ? 1 : 0;
      })
    );
    activeStoresCount = storesWithProducts.reduce((sum: number, val) => sum + val, 0);
  }

  const stats = {
    totalUsers: usersCount || 0,
    totalProducts: productsCount || 0,
    totalCategories: categoriesCount || 0,
    activeProducts: activeCount || 0,
    totalViews,
    activeStores: activeStoresCount,
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AdminDashboardClient initialStats={stats} />
    </Suspense>
  );
}

export default AdminDashboardPage;