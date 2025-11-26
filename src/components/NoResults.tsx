import { Search } from 'lucide-react';

interface NoResultsProps {
  onReset: () => void;
}

export const NoResults = ({ onReset }: NoResultsProps) => (
  <div className="text-center py-16">
    <div className="flex justify-center mb-6">
      <div className="p-6 bg-gray-100 rounded-full">
        <Search size={64} className="text-gray-400" />
      </div>
    </div>

    <h2 className="text-2xl font-bold text-gray-900 mb-3">Tidak Ada Hasil</h2>

    <p className="text-gray-600 mb-8">
      Tidak ada produk yang cocok dengan filter atau pencarian Anda
    </p>

    <button
      onClick={onReset}
      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
    >
      Reset Filter
    </button>
  </div>
);
