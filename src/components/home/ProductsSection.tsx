"use client";

import { Product } from "@/app/page";
import { Eye, Store, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface ProductsSectionProps {
  products: Product[];
}

export const ProductsSection = ({ products }: ProductsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const items = section?.querySelectorAll(".animate-fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.1 }
    );
    items?.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="products" className="space-y-10 px-4 sm:px-8">
      {/* Header */}
      <div className="flex justify-between items-center opacity-0 translate-y-6 animate-fade-up transition-all duration-700">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Produk Terbaru
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Produk fresh dari UMKM lokal
          </p>
        </div>
        <Button
          variant="ghost"
          className="group hidden md:flex hover:bg-primary/10 hover:text-primary transition-all"
          asChild
        >
          <Link href="/products">
            Lihat Semua
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      {/* Jika belum ada produk */}
      {products.length === 0 ? (
        <div className="animate-fade-up bg-card rounded-2xl shadow-lg p-16 text-center border border-border opacity-0 translate-y-6 transition-all duration-700">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full shadow-inner">
              <Store className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Belum Ada Produk
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Produk dari UMKM akan ditampilkan di sini
          </p>
          <Button asChild className="hover:scale-105 active:scale-95 transition-transform">
            <Link href="#cta">Jadilah Penjual Pertama!</Link>
          </Button>
        </div>
      ) : (
        <div className="relative">
          {/* Scrollable wrapper */}
          <div
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 pb-8 xl:pb-10 scroll-snap-x"
            style={{ maskImage: "linear-gradient(to right, black 85%, transparent)" }}
          >
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={`card group min-w-[80%] sm:min-w-[55%] md:min-w-[35%] lg:min-w-[21%] xl:min-w-[20%]
                  bg-card rounded-2xl shadow-md overflow-hidden border border-border cursor-pointer
                  opacity-0 translate-y-6 animate-fade-up transition-all duration-700
                  hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]
                  touch-manipulation`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gambar (tinggi diperkecil) */}
                <div className="h-48 sm:h-56 md:h-64 bg-muted relative overflow-hidden">
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
                    <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary border border-primary/20 shadow-sm">
                      {product.categories.name}
                    </div>
                  )}
                </div>

                {/* Konten */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="font-semibold text-lg sm:text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Store className="h-4 w-4" />
                    <span className="truncate">
                      {product.profiles?.store_name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-border">
                    <span className="text-xl font-bold text-primary">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>{product.views || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Panah kanan (desktop only) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-md">
            <ArrowRight className="h-6 w-6 text-primary" />
          </div>
        </div>
      )}

      {/* Tombol mobile */}
      <div className="text-center md:hidden">
        <Button
          variant="outline"
          className="hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all"
          asChild
        >
          <Link href="/products">
            Lihat Semua Produk
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};