"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Store, Package, Edit } from "lucide-react";
import React from "react";

interface ProductCardProps {
  product: any;
  showEdit?: boolean; // untuk dashboard
  showStore?: boolean; // untuk tampilkan nama toko
  profileName?: string; // nama toko (dari profil dashboard)
  index?: number; // animasi delay
  children?: React.ReactNode; // ✅ Tambahkan ini supaya bisa kirim toggle dari luar
}

export const ProductCard = ({
  product,
  showEdit = false,
  showStore = true,
  profileName,
  index = 0,
  children, // ✅ Tambahkan ini
}: ProductCardProps) => {
  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group rounded-2xl overflow-hidden bg-white border border-border shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
    >
      {/* Gambar Produk */}
      <div className="relative h-48 sm:h-56 bg-muted overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Package className="h-14 w-14 text-muted-foreground/50" />
          </div>
        )}
        {product.categories && (
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary border border-primary/20 shadow-sm">
            {product.categories?.name || "Kategori"}
          </div>
        )}
      </div>

      {/* Detail Produk */}
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {showStore && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Store className="h-4 w-4" />
            <span className="truncate">
              {product.profiles?.store_name || profileName || "Toko"}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="text-xl font-bold text-primary">
            Rp {product.price?.toLocaleString("id-ID")}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>{product.views || 0}</span>
          </div>
        </div>

        {/* ✅ Tambahkan toggle atau konten tambahan di bawah harga */}
        {children && <div className="pt-3">{children}</div>}

        {/* Tombol (jika di dashboard) */}
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
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {product.is_active ? "Aktif" : "Nonaktif"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
