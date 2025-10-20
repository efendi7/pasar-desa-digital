"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, Store, Package, Edit } from "lucide-react";
import React from "react";

interface ProductCardProps {
  product: any;
  showEdit?: boolean;
  showStore?: boolean;
  profileName?: string;
  index?: number;
  children?: React.ReactNode;
}

export const ProductCard = React.memo(function ProductCard({
  product,
  showEdit = false,
  showStore = true,
  profileName,
  index = 0,
  children,
}: ProductCardProps) {
  return (
    <div
      className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 flex flex-col h-full"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Gambar produk */}
      <div className="relative h-48 sm:h-56 bg-muted dark:bg-zinc-800 overflow-hidden">
        {product.image_url ? (
          <Image
            src={`${product.image_url}?w=600&auto=format&fit=crop&q=80`}
            alt={product.name}
            width={600}
            height={400}
            decoding="async"
            priority={index < 2}
            loading={index < 2 ? undefined : "lazy"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted dark:bg-zinc-800">
            <Package className="h-14 w-14 text-muted-foreground/50 dark:text-zinc-600" />
          </div>
        )}
      </div>

      {/* Detail produk */}
      <div className="p-5 space-y-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-foreground dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug h-14">
          {product.name}
        </h3>

        {showStore && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-zinc-400">
            <Store className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {product.profiles?.store_name || profileName || "Toko"}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-border dark:border-zinc-700 mt-auto">
          <span className="text-xl font-bold text-primary dark:text-blue-400">
            Rp {product.price?.toLocaleString("id-ID")}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground dark:text-zinc-400">
            <Eye className="h-3 w-3" />
            <span>{product.views || 0}</span>
          </div>
        </div>

        {children && <div className="pt-3">{children}</div>}

        {showEdit && (
          <div className="flex gap-2 pt-3">
            <Link
              href={`/dashboard/products/edit/${product.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Edit className="w-4 h-4" /> Edit
            </Link>
            <span
              className={`flex-1 text-center py-2 text-sm font-medium rounded-lg ${
                product.is_active
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {product.is_active ? "Aktif" : "Nonaktif"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.views === nextProps.product.views &&
    prevProps.product.is_active === nextProps.product.is_active &&
    prevProps.showEdit === nextProps.showEdit &&
    prevProps.showStore === nextProps.showStore
  );
});
