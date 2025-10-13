import { SortByType } from '@/types';

interface SortFilterProps {
  value: SortByType;
  onChange: (value: SortByType) => void;
}

export const SortFilter = ({ value, onChange }: SortFilterProps) => (
  <div>
    <label className="block text-sm font-semibold text-gray-900 mb-2">Urutkan Berdasarkan</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortByType)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
    >
      <option value="newest">Terbaru</option>
      <option value="oldest">Terlama</option>
      <option value="most_views">Views Terbanyak</option>
      <option value="least_views">Views Tersedikit</option>
    </select>
  </div>
);