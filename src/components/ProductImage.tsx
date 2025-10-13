import { Package } from 'lucide-react';

interface ProductImageProps {
  imageUrl?: string | null;
  name: string;
  variant: 'desktop' | 'mobile';
}

export const ProductImage = ({ imageUrl, name, variant }: ProductImageProps) => {
  const { containerClass, iconSize } = variant === 'desktop' 
    ? { containerClass: 'w-16 h-16', iconSize: 28 }
    : { containerClass: 'w-20 h-20', iconSize: 32 };
  return (
    <div className={`${containerClass} bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200`}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <Package size={iconSize} />
        </div>
      )}
    </div>
  );
};