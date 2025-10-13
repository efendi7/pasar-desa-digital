import { Category } from '@/types';

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
}

export const CategoryFilter = ({ value, onChange, categories }: CategoryFilterProps) => (
  <div>
    <label className="block text-sm font-semibold text-gray-900 mb-2">Kategori</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
    >
      <option value="all">Semua Kategori</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  </div>
);