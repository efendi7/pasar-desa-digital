import { Check, X } from 'lucide-react';

interface ProductStatusButtonProps {
  isActive: boolean;
  onToggle: () => void;
  variant?: 'desktop' | 'mobile';
  showText?: boolean;
}

export const ProductStatusButton = ({
  isActive,
  onToggle,
  variant = 'desktop',
  showText = true,
}: ProductStatusButtonProps) => {
  const size = variant === 'mobile' ? 'small' : 'default';
  const iconSize = size === 'small' ? 12 : 14;
  const paddingClass = size === 'small' ? 'px-2.5 py-1' : 'px-3 py-1.5';
  const colorClass = isActive
    ? `bg-green-100 text-green-700 ${size === 'default' ? 'hover:bg-green-200' : ''}`
    : size === 'default'
    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    : 'bg-gray-200 text-gray-700';
  return (
    <button
      onClick={onToggle}
      className={`rounded-lg text-xs font-semibold transition-all flex items-center ${paddingClass} gap-1.5 ${colorClass}`}
    >
      {isActive ? <Check size={iconSize} /> : <X size={iconSize} />}
      {showText && <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>}
    </button>
  );
};