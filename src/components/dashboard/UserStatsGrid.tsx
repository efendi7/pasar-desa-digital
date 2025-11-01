'use client';

import React, { memo, useMemo } from 'react';
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

const UserStatsGrid = memo(function UserStatsGrid({ stats }: UserStatsGridProps) {
  const items = useMemo(
    () =>
      userStatsData.map((stat, index) => (
        <UserStatCard
          key={stat.label}
          stat={stat}
          value={stats[stat.key as keyof UserStats]}
          index={index}
        />
      )),
    [stats]
  );

  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">{items}</div>;
});

export default UserStatsGrid;
