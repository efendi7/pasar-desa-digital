'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { StatConfig } from '@/config/admin/dashboard/statsConfig';

interface StatCardProps {
  stat: StatConfig;
  value: number;
  index: number;
}

export default function StatCard({ stat, value, index }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${stat.cardBgColor} border ${stat.borderColor} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all`}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className={`${stat.bgColor} p-2 sm:p-3 rounded-xl flex-shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.textColor}`} />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          <AnimatedCounter value={value} />
        </p>
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
    </motion.div>
  );
}