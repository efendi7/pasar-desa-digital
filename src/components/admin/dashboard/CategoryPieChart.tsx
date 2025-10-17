'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryPieChartProps {
  data: any[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Produk per Kategori</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}