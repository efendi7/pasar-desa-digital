'use client';

import UserStatCard from './UserStatsCard';
import { userStatsData } from '@/config/dashboard/userStatsConfig';

interface UserStats {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
}

interface UserStatsGridProps {
  stats: UserStats;
}

export default function UserStatsGrid({ stats }: UserStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {userStatsData.map((stat, index) => (
        <UserStatCard
          key={stat.label}
          stat={stat}
          value={stats[stat.key as keyof UserStats]}
          index={index}
        />
      ))}
    </div>
  );
}