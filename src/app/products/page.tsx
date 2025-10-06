import { Suspense } from 'react';
import ProductsClient from './ProductsClient';

// Skeleton Components
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen">
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-600">
          <li>Beranda</li>
          <li>/</li>
          <li className="text-gray-900 font-medium">Katalog Produk</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Katalog Produk
        </h1>
        <p className="text-gray-600">
          Temukan produk UMKM terbaik dari desa
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="md:w-64">
            <div className="h-10 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      <ProductsGridSkeleton />
    </div>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; search?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const category = searchParams.category || 'all';
  const search = searchParams.search || '';

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsClient 
        initialPage={page}
        initialCategory={category}
        initialSearch={search}
      />
    </Suspense>
  );
}