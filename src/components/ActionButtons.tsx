import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  productId: string;
  imageUrl?: string | null;
  onDelete: (id: string, url: string | null) => void | Promise<void>;
  editHref: string;
  variant?: 'desktop' | 'mobile';
}

export const ActionButtons = ({
  productId,
  imageUrl,
  onDelete,
  editHref,
  variant = 'desktop',
}: ActionButtonsProps) => {
  const handleDelete = () => onDelete(productId, imageUrl ?? null);
  
  const baseClass = `font-medium transition-colors flex items-center gap-1.5 ${
    variant === 'mobile' ? 'flex-1 px-4 py-2.5 text-sm rounded-xl justify-center' : 'px-4 py-2 text-sm rounded-lg'
  }`;
  
  return (
    <div className="flex gap-2">
      <Link href={editHref} className={`${baseClass} bg-blue-600 text-white hover:bg-blue-700`}>
        <Edit size={16} />
        Edit
      </Link>
      <button onClick={handleDelete} className={`${baseClass} bg-red-600 text-white hover:bg-red-700`}>
        <Trash2 size={16} />
        Hapus
      </button>
    </div>
  );
};