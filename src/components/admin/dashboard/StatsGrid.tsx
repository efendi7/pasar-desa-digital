'use client';

import StatCard from './StatsCard';
import { statsData } from '@/config/admin/dashboard/statsConfig';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  activeProducts: number;
  totalViews: number;
  activeStores: number;
}

interface StatsGridProps {
  stats: Stats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
      {statsData.map((stat, index) => (
        <StatCard
          key={stat.label}
          stat={stat}
          value={stats[stat.key as keyof Stats]}
          index={index}
        />
      ))}
    </div>
  );
}