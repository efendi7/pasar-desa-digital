'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface GrowthChartProps {
  data: any[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Pertumbuhan Bulanan</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
          <YAxis stroke="#6b7280" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Users"
            dot={{ fill: '#3b82f6', r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="products"
            stroke="#10b981"
            strokeWidth={2}
            name="Produk"
            dot={{ fill: '#10b981', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}