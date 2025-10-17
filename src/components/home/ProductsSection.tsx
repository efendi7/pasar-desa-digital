"use client";

import { Product } from "@/app/page";
import { ArrowLeft, ArrowRight, Store, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterToggle } from "@/components/FilterToggle";

interface ProductsSectionProps {
  products: Product[];
}

export const ProductsSection = ({ products }: ProductsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<"latest" | "popular">("latest");

  // Ambil 10 produk terbaru
  const latestProducts = [...products]
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 10);

  // Ambil 10 produk terpopuler
  const popularProducts = [...products]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  // Tentukan produk mana yang ditampilkan
  const displayedProducts = activeFilter === "latest" ? latestProducts : popularProducts;

  // Efek untuk animasi fade-up saat scroll
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

  // Reset scroll position saat filter berubah
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeFilter]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const firstCard = container.querySelector(".card") as HTMLElement;
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 24;
        container.scrollBy({
          left: direction === "right" ? scrollAmount : -scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section ref={sectionRef} id="products" className="space-y-10 px-4 sm:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-0 translate-y-6 animate-fade-up transition-all duration-700">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            {activeFilter === "latest" ? (
              <>
                <Sparkles className="h-8 w-8 text-primary" />
                Produk Terbaru
              </>
            ) : (
              <>
                <TrendingUp className="h-8 w-8 text-primary" />
                Produk Terpopuler
              </>
            )}
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            {activeFilter === "latest"
              ? "10 produk terbaru dari UMKM lokal"
              : "10 produk dengan views terbanyak"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
          {/* Filter Toggle Buttons */}
          <FilterToggle 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          
          <Button
            variant="ghost"
            className="group hover:bg-primary/10 hover:text-primary transition-all hidden sm:flex"
            asChild
          >
            <Link href="/products">
              Lihat Semua
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      {displayedProducts.length === 0 ? (
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
          <Button
            asChild
            className="hover:scale-105 active:scale-95 transition-transform"
          >
            <Link href="#cta">Jadilah Penjual Pertama!</Link>
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 pb-8 xl:pb-10 scroll-snap-x transition-opacity duration-300"
            style={{
              maskImage: "linear-gradient(to right, black 85%, transparent)",
            }}
          >
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className="card min-w-[80%] sm:min-w-[55%] md:min-w-[35%] lg:min-w-[21%] xl:min-w-[20%]"
              >
                <Link href={`/products/${product.id}`}>
                  <ProductCard product={product} index={index} />
                </Link>
              </div>
            ))}
          </div>

          {/* Tombol Navigasi */}
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-14 w-14 bg-background/80 backdrop-blur-md border border-border shadow-md hover:scale-105 active:scale-95 transition-transform pointer-events-auto"
              onClick={() => handleScroll("left")}
            >
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-14 w-14 bg-background/80 backdrop-blur-md border border-border shadow-md hover:scale-105 active:scale-95 transition-transform pointer-events-auto"
              onClick={() => handleScroll("right")}
            >
              <ArrowRight className="h-6 w-6 text-primary" />
            </Button>
          </div>
        </div>
      )}

      <div className="text-center">
        <Button
          variant="outline"
          className="hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all sm:hidden"
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