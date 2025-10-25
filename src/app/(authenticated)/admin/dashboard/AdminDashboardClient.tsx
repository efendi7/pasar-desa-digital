'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PageHeader } from '@/components/PageHeader';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import GrowthChart from '@/components/admin/dashboard/GrowthChart';
import CategoryPieChart from '@/components/admin/dashboard/CategoryPieChart';
import CategoryBarChart from '@/components/admin/dashboard/CategoryBarChart';
import ActivityChart from '@/components/admin/dashboard/ActivityChart';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import { Activity } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  activeProducts: number;
  totalViews: number;
  activeStores: number;
}

interface AdminDashboardClientProps {
  initialStats: Stats;
}

export default function AdminDashboardClient({ initialStats }: AdminDashboardClientProps) {
  const supabase = createClient();
  const [stats] = useState<Stats>(initialStats);
  const [monthlyGrowth, setMonthlyGrowth] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyGrowth();
    fetchCategoryData();
    fetchActivityData();
  }, []);

  const fetchMonthlyGrowth = async () => {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const currentMonth = new Date().getMonth();
      const growthData = [];

      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const year = new Date().getFullYear() - (currentMonth - i < 0 ? 1 : 0);
        const monthStart = new Date(year, monthIndex, 1);
        const monthEnd = new Date(year, monthIndex + 1, 0);

        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        growthData.push({
          month: months[monthIndex],
          users: usersCount || 0,
          products: productsCount || 0,
        });
      }

      setMonthlyGrowth(growthData);
    } catch (error) {
      console.error('Error fetching monthly growth:', error);
      setMonthlyGrowth([
        { month: 'Jan', users: 0, products: 0 },
        { month: 'Feb', users: 0, products: 0 },
        { month: 'Mar', users: 0, products: 0 },
        { month: 'Apr', users: 0, products: 0 },
        { month: 'Mei', users: 0, products: 0 },
        { month: 'Jun', users: 0, products: 0 },
      ]);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name');

      if (categories) {
        const categoryStats = await Promise.all(
          categories.map(async (category) => {
            const { count } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id);

            return {
              name: category.name,
              value: count || 0,
            };
          })
        );

        const filteredStats = categoryStats.filter(stat => stat.value > 0);
        setCategoryData(filteredStats.length > 0 ? filteredStats : [{ name: 'Belum ada data', value: 1 }]);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      setCategoryData([{ name: 'Belum ada data', value: 1 }]);
    }
  };

  const fetchActivityData = async () => {
    try {
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);

      const { data: dailyViews, error } = await supabase
        .from('product_views_daily')
        .select('view_date, views')
        .gte('view_date', sevenDaysAgo.toISOString().split('T')[0])
        .lte('view_date', today.toISOString().split('T')[0])
        .order('view_date', { ascending: true });

      if (error) {
        console.error('❌ Gagal ambil data harian:', error);
        setActivityData([]);
        setLoading(false);
        return;
      }

      const formatted = dailyViews.map((item) => {
        const date = new Date(item.view_date);
        const dayName = days[date.getDay()];
        return {
          day: dayName,
          views: item.views,
        };
      });

      const filled = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        const dayName = days[d.getDay()];
        const found = formatted.find((f) => f.day === dayName);
        return found || { day: dayName, views: 0 };
      });

      setActivityData(filled);
    } catch (error) {
      console.error('Error fetching daily activity:', error);
      setActivityData([
        { day: 'Sen', views: 0 },
        { day: 'Sel', views: 0 },
        { day: 'Rab', views: 0 },
        { day: 'Kam', views: 0 },
        { day: 'Jum', views: 0 },
        { day: 'Sab', views: 0 },
        { day: 'Min', views: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Kelola dan pantau platform Anda"
          icon={<Activity className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />}
        />
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <StatsGrid stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <GrowthChart data={monthlyGrowth} />
            <CategoryPieChart data={categoryData} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <CategoryBarChart data={categoryData} />
            <ActivityChart data={activityData} />
          </div>
          <QuickActions
            showQuickActions={showQuickActions}
            setShowQuickActions={setShowQuickActions}
          />
        </div>
      </div>
    </div>
  );
}