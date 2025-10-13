import { FilterStatus } from '@/types';

interface StatusFilterProps {
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  const options = [
    { key: 'all' as FilterStatus, label: 'Semua' },
    { key: 'active' as FilterStatus, label: 'Aktif' },
    { key: 'inactive' as FilterStatus, label: 'Nonaktif' },
  ];
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">Status Produk</label>
      <div className="flex gap-2">
        {options.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              value === key ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};