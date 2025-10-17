'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryBarChartProps {
  data: any[];
}

export default function CategoryBarChart({ data }: CategoryBarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Distribusi Kategori</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
          <YAxis stroke="#6b7280" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}