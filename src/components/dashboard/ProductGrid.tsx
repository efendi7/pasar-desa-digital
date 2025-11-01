'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, index) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <ProductCard product={product} showEdit={false} showStore={true} index={index} />
        </Link>
      ))}
    </div>
  );
}
