import { Package, Store, Eye, LucideIcon } from 'lucide-react';

export interface UserStatConfig {
  icon: LucideIcon;
  key: string;
  label: string;
  color: string;
  bgColor: string;
  cardBgColor: string;
  borderColor: string;
  textColor: string;
}

export const userStatsData: UserStatConfig[] = [
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
    icon: Store,
    key: 'activeProducts',
    label: 'Produk Aktif',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    cardBgColor: 'bg-blue-50/30',
    borderColor: 'border-blue-100',
    textColor: 'text-blue-600',
  },
  {
    icon: Eye,
    key: 'totalViews',
    label: 'Total Views',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    cardBgColor: 'bg-purple-50/30',
    borderColor: 'border-purple-100',
    textColor: 'text-purple-600',
  },
];