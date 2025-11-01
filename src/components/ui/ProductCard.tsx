'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, Store, Package, Edit, Tag, MapPin } from 'lucide-react';
import React, { memo } from 'react';

interface ProductCardProps {
  product: any;
  showEdit?: boolean;
  showStore?: boolean;
  profileName?: string;
  index?: number;
  children?: React.ReactNode;
}

interface CardMetaProps {
  icon: React.ReactElement<{ className?: string }>;
  text: string;
}

/** Komponen kecil untuk meta info seperti kategori, dusun, toko */
const CardMeta = ({ icon, text }: CardMetaProps) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-zinc-400">
    {React.cloneElement(icon, { className: 'h-4 w-4 flex-shrink-0' })}
    <span className="truncate">{text}</span>
  </div>
);

/** Komponen utama untuk kartu produk */
const ProductCard = memo(
  function ProductCard({
    product,
    showEdit = false,
    showStore = true,
    profileName,
    index = 0,
    children,
  }: ProductCardProps) {
    const {
      id,
      name,
      price,
      views = 0,
      image_url,
      is_active,
      categories,
      dusun,
      profiles,
    } = product;

    return (
      <div
        className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 flex flex-col h-full will-change-transform"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Gambar produk */}
        <div className="relative h-48 sm:h-56 bg-muted dark:bg-zinc-800 overflow-hidden">
          {image_url ? (
            <Image
              src={`${image_url}?w=600&auto=format&fit=crop&q=80`}
              alt={name}
              width={600}
              height={400}
              decoding="async"
              priority={index < 2}
              loading={index < 2 ? undefined : 'lazy'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted dark:bg-zinc-800">
              <Package className="h-14 w-14 text-muted-foreground/50 dark:text-zinc-600" />
            </div>
          )}
        </div>

        {/* Detail produk */}
        <div className="p-5 flex flex-col flex-grow space-y-3">
          {/* Nama produk */}
          <h3 className="font-semibold text-lg text-foreground dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug min-h-[3.5rem]">
            {name}
          </h3>

          {/* Kategori */}
          {categories?.name && <CardMeta icon={<Tag />} text={categories.name} />}

          {/* Dusun */}
          {dusun?.name && <CardMeta icon={<MapPin />} text={dusun.name} />}

          {/* Nama Toko */}
          {showStore && (
            <CardMeta
              icon={<Store />}
              text={profiles?.store_name || profileName || 'Toko'}
            />
          )}

          {/* Harga & Views */}
          <div className="flex justify-between items-center pt-3 border-t border-border dark:border-zinc-700 mt-auto">
            <span className="text-xl font-bold text-primary dark:text-blue-400">
              Rp {price?.toLocaleString('id-ID')}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground dark:text-zinc-400">
              <Eye className="h-3 w-3" />
              <span>{views}</span>
            </div>
          </div>

          {children && <div className="pt-3">{children}</div>}

          {/* Tombol Edit & Status */}
          {showEdit && (
            <div className="flex gap-2 pt-3">
              <Link
                href={`/dashboard/products/edit/${id}`}
                className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4" /> Edit
              </Link>
              <span
                className={`flex-1 text-center py-2 text-sm font-medium rounded-lg ${
                  is_active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {is_active ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.product.views === next.product.views &&
    prev.product.is_active === next.product.is_active &&
    prev.showEdit === next.showEdit &&
    prev.showStore === next.showStore
);

export { ProductCard };
