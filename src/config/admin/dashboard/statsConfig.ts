import { Users, Package, CheckCircle2, Store, Eye, FolderTree, LucideIcon } from 'lucide-react';

export interface StatConfig {
  icon: LucideIcon;
  key: string;
  label: string;
  color: string;
  bgColor: string;
  cardBgColor: string;
  borderColor: string;
  textColor: string;
}

export const statsData: StatConfig[] = [
  {
    icon: Users,
    key: 'totalUsers',
    label: 'Total Users',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    cardBgColor: 'bg-blue-50/30',
    borderColor: 'border-blue-100',
    textColor: 'text-blue-600',
  },
  {
    icon: Package,
    key: 'totalProducts',
    label: 'Total Produk',
    color: 'from-emerald-400 to-green-600',
    bgColor: 'bg-green-50',
    cardBgColor: 'bg-green-50/30',
    borderColor: 'border-green-100',
    textColor: 'text-green-600',
  },
  {
    icon: CheckCircle2,
    key: 'activeProducts',
    label: 'Produk Aktif',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    cardBgColor: 'bg-purple-50/30',
    borderColor: 'border-purple-100',
    textColor: 'text-purple-600',
  },
  {
    icon: Store,
    key: 'activeStores',
    label: 'Toko Aktif',
    color: 'from-pink-400 to-pink-600',
    bgColor: 'bg-pink-50',
    cardBgColor: 'bg-pink-50/30',
    borderColor: 'border-pink-100',
    textColor: 'text-pink-600',
  },
  {
    icon: Eye,
    key: 'totalViews',
    label: 'Total Views',
    color: 'from-cyan-400 to-cyan-600',
    bgColor: 'bg-cyan-50',
    cardBgColor: 'bg-cyan-50/30',
    borderColor: 'border-cyan-100',
    textColor: 'text-cyan-600',
  },
  {
    icon: FolderTree,
    key: 'totalCategories',
    label: 'Kategori',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    cardBgColor: 'bg-orange-50/30',
    borderColor: 'border-orange-100',
    textColor: 'text-orange-600',
  },
];