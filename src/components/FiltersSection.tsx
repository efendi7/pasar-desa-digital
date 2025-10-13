import { SearchInput } from './SearchInput';
import { StatusFilter } from './StatusFilter';
import { CategoryFilter } from './CategoryFilter';
import { SortFilter } from './SortFilter';
import { FilterStatus, SortByType, Category } from '@/types';

interface FiltersSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: FilterStatus;
  onStatusChange: (value: FilterStatus) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
  sortBy: SortByType;
  onSortChange: (value: SortByType) => void;
}

export const FiltersSection = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
}: FiltersSectionProps) => (
  <div className="px-6 sm:px-8 py-6 space-y-4 border-b border-gray-100">
    <SearchInput value={searchQuery} onChange={onSearchChange} />
    <div className="grid sm:grid-cols-3 gap-4">
      <StatusFilter value={filterStatus} onChange={onStatusChange} />
      <CategoryFilter value={filterCategory} onChange={onCategoryChange} categories={categories} />
      <SortFilter value={sortBy} onChange={onSortChange} />
    </div>
  </div>
);