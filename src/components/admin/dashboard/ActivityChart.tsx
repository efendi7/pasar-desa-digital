'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
  data: any[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Aktivitas Mingguan</h3>
        <span className="text-xs text-gray-500">(Views & Updates)</span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
          <YAxis stroke="#6b7280" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorViews)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}