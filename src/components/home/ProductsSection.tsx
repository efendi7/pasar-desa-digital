"use client";

import { Product } from "@/app/page";
import {
  Eye,
  Store,
  ArrowLeft,
  ArrowRight,
  Package,
  TrendingUp,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductsSectionProps {
  products: Product[];
}

export const ProductsSection = ({ products }: ProductsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Menggunakan hook dari Next.js untuk interaksi dengan URL
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Inisialisasi state filter dari URL, dengan "latest" sebagai default
  const [filter, setFilter] = useState<"latest" | "popular">(
    (searchParams.get("filter") as "latest" | "popular") || "latest"
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Efek untuk animasi fade-up saat scroll (tidak berubah)
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

  // Mengembalikan posisi scroll saat navigasi kembali
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("productScrollPos");
    if (scrollPosition && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = Number(scrollPosition);
      sessionStorage.removeItem("productScrollPos"); // Hapus setelah digunakan agar tidak mempengaruhi navigasi lain
    }
  }, []);

  // Mengurutkan produk berdasarkan filter yang aktif
  const filteredProducts =
    filter === "latest"
      ? [...products].sort((a, b) => (b.id > a.id ? 1 : -1))
      : [...products].sort((a, b) => (b.views || 0) - (a.views || 0));

  // Fungsi untuk mengubah filter
  const handleFilterChange = (newFilter: "latest" | "popular") => {
    if (newFilter === filter) return;

    setIsTransitioning(true);
    setFilter(newFilter);

    // Update URL dengan parameter filter baru tanpa me-reload halaman
    const params = new URLSearchParams(searchParams);
    params.set("filter", newFilter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    // Scroll ke awal setelah filter diganti
    setTimeout(() => {
      scrollContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }, 100);
    setTimeout(() => setIsTransitioning(false), 600);
  };
  
  // Fungsi untuk menyimpan posisi scroll sebelum pindah halaman
  const handleProductClick = () => {
    if (scrollContainerRef.current) {
      sessionStorage.setItem("productScrollPos", scrollContainerRef.current.scrollLeft.toString());
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      // Ambil card pertama untuk mengukur lebarnya
      const firstCard = container.querySelector('.card') as HTMLElement;
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 24; // Lebar card + gap (24px atau 1.5rem)
        
        container.scrollBy({
          left: direction === 'right' ? scrollAmount : -scrollAmount,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <section ref={sectionRef} id="products" className="space-y-10 px-4 sm:px-8">
      <div className="flex justify-between items-center opacity-0 translate-y-6 animate-fade-up transition-all duration-700">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {filter === "latest" ? "Produk Terbaru" : "Produk Terpopuler"}
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            {filter === "latest"
              ? "Produk fresh dari UMKM lokal"
              : "Produk dengan jumlah view terbanyak"}
          </p>
        </div>

        {/* Filter untuk Desktop */}
        <div className="hidden sm:flex gap-2 items-center">
          <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border/50 backdrop-blur-sm">
            <Button variant={filter === "latest" ? "default" : "ghost"} onClick={() => handleFilterChange("latest")} size="sm" className="transition-all duration-300 rounded-lg">
              <Sparkles className="mr-2 h-4 w-4" /> Terbaru
            </Button>
            <Button variant={filter === "popular" ? "default" : "ghost"} onClick={() => handleFilterChange("popular")} size="sm" className="transition-all duration-300 rounded-lg">
              <TrendingUp className="mr-2 h-4 w-4" /> Terpopuler
            </Button>
          </div>
          <Button variant="ghost" className="group hover:bg-primary/10 hover:text-primary transition-all" asChild>
            <Link href="/products">Lihat Semua <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
          </Button>
        </div>

        {/* Filter untuk Mobile (Dropdown) */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filter === "latest" ? "Terbaru" : "Terpopuler"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleFilterChange("latest")}>
                <Sparkles className="mr-2 h-4 w-4" /> Terbaru
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleFilterChange("popular")}>
                <TrendingUp className="mr-2 h-4 w-4" /> Terpopuler
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="animate-fade-up bg-card rounded-2xl shadow-lg p-16 text-center border border-border opacity-0 translate-y-6 transition-all duration-700">
          <div className="mb-4 flex justify-center"><div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full shadow-inner"><Store className="h-10 w-10 text-muted-foreground" /></div></div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Belum Ada Produk</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Produk dari UMKM akan ditampilkan di sini</p>
          <Button asChild className="hover:scale-105 active:scale-95 transition-transform"><Link href="#cta">Jadilah Penjual Pertama!</Link></Button>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className={`flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 pb-8 xl:pb-10 scroll-snap-x transition-opacity duration-300 ${isTransitioning ? "opacity-50" : "opacity-100"}`}
            style={{ maskImage: "linear-gradient(to right, black 85%, transparent)" }}
          >
            {filteredProducts.map((product, index) => (
  <div
    key={product.id}
    onClick={handleProductClick}
    className="card min-w-[80%] sm:min-w-[55%] md:min-w-[35%] lg:min-w-[21%] xl:min-w-[20%]"
  >
    <Link href={`/products/${product.id}`}>
      <ProductCard product={product} index={index} />
    </Link>
  </div>
))}

            
            
          </div>
          
          {/* ✅ FIX: Tombol Panah Kiri dan Kanan dengan fungsi onClick */}
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between px-[-28px]">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-14 w-14 bg-background/80 backdrop-blur-md border border-border shadow-md hover:scale-105 active:scale-95 transition-transform"
              onClick={() => handleScroll('left')}
            >
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-14 w-14 bg-background/80 backdrop-blur-md border border-border shadow-md hover:scale-105 active:scale-95 transition-transform"
              onClick={() => handleScroll('right')}
            >
              <ArrowRight className="h-6 w-6 text-primary" />
            </Button>
        </div>
      </div>
    )}
      <div className="text-center md:hidden">
        <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all" asChild>
          <Link href="/products">Lihat Semua Produk <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
};