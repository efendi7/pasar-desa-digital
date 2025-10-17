'use client';

import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { UserStatConfig } from '@/config/dashboard/userStatsConfig';

interface UserStatCardProps {
  stat: UserStatConfig;
  value: number;
  index: number;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString('id-ID'));
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, { duration: 1.5, ease: 'easeOut' });
      return animation.stop;
    }
  }, [isInView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export default function UserStatCard({ stat, value, index }: UserStatCardProps) {
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