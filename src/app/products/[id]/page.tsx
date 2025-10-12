'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Profile {
  id?: string;
  store_name?: string;
  full_name?: string;
  whatsapp_number?: string;
  store_description?: string;
}

interface Category {
  name?: string;
  slug?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category_id?: string;
  profiles?: Profile;
  categories?: Category;
  image_url?: string;
  image_url_1?: string;
  image_url_2?: string;
  image_url_3?: string;
  views?: number;
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClient();
  const params = useParams();
  const productId = params.id as string;

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!productId || hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadProduct();
  }, [productId]);

  function hasViewedToday(productId: string): boolean {
    const viewsData = localStorage.getItem('product_views');
    if (!viewsData) return false;

    try {
      const views: Record<string, string> = JSON.parse(viewsData);
      const lastViewDate = views[productId];
      if (!lastViewDate) return false;

      const today = new Date().toDateString();
      const lastView = new Date(lastViewDate).toDateString();
      return today === lastView;
    } catch {
      return false;
    }
  }

  function markAsViewedToday(productId: string) {
    const viewsData = localStorage.getItem('product_views');
    let views: Record<string, string> = {};

    if (viewsData) {
      try {
        views = JSON.parse(viewsData);
      } catch {
        views = {};
      }
    }

    views[productId] = new Date().toISOString();
    localStorage.setItem('product_views', JSON.stringify(views));
  }

  async function loadProduct() {
    setLoading(true);

    const { data: productData, error: productError } = await supabase
      .from('products')
      .select(
        '*, profiles(id, full_name, store_name, store_description, whatsapp_number), categories(name, slug), image_url_1, image_url_2, image_url_3'
      )
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !productData) {
      setError('Produk tidak ditemukan');
      setLoading(false);
      return;
    }

    setProduct(productData);

    const alreadyViewed = hasViewedToday(productId);
    if (!alreadyViewed) {
      await supabase.rpc('increment_views', { product_id: productId });
      markAsViewedToday(productId);
    }

    if (productData.category_id) {
      const { data: relatedData } = await supabase
        .from('products')
        .select('*, profiles(store_name), image_url_1')
        .eq('category_id', productData.category_id)
        .eq('is_active', true)
        .neq('id', productId)
        .limit(4);

      setRelatedProducts(relatedData || []);
    }

    setLoading(false);
  }

  function handleWhatsAppClick() {
    if (!product?.profiles?.whatsapp_number) {
      alert('Nomor WhatsApp penjual belum tersedia');
      return;
    }

    const phone = product.profiles.whatsapp_number.startsWith('62')
      ? product.profiles.whatsapp_number
      : `62${product.profiles.whatsapp_number}`;

    const message = `Halo ${product.profiles.store_name || ''}, saya tertarik dengan produk *${product.name}* seharga Rp ${product.price.toLocaleString('id-ID')}. Apakah masih tersedia?`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
            <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
            <div className="h-10 bg-gray-200 w-2/3 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {error || 'Produk Tidak Ditemukan'}
        </h2>
        <Link href="/products" className="text-green-600 hover:underline">
          ← Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const images = [
    product.image_url,
    product.image_url_1,
    product.image_url_2,
    product.image_url_3,
  ].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-green-600">Beranda</Link> {' > '}
        <Link href="/products" className="hover:text-green-600">Produk</Link> {' > '}
        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Detail Produk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-square bg-gray-100">
            {images.length ? (
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-8xl">
                📦
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <div className="text-4xl font-bold text-green-600 mb-6">
            Rp {product.price.toLocaleString('id-ID')}
          </div>

          <p className="text-gray-600 mb-6 whitespace-pre-wrap">{product.description}</p>

          {/* Info Penjual */}
          <div className="border-t pt-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Penjual:</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl font-bold">
                {product.profiles?.store_name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                {product.profiles?.store_name ? (
                  <Link
                    href={`/store/${product.profiles.id}`}
                    className="font-semibold text-green-700 hover:underline hover:text-green-800"
                  >
                    {product.profiles.store_name}
                  </Link>
                ) : (
                  <p className="font-semibold text-gray-800">Tidak tersedia</p>
                )}
                <p className="text-sm text-gray-500">{product.profiles?.full_name || "-"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsAppClick}
            className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 text-lg"
          >
            💬 Hubungi Penjual
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Klik untuk chat langsung via WhatsApp
          </p>
        </div>
      </div>

      {/* Produk Serupa */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Produk Serupa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/products/${rp.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={rp.image_url || rp.image_url_1 || '/placeholder.png'}
                    alt={rp.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-green-600">
                    {rp.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {rp.profiles?.store_name || "-"}
                  </p>
                  <span className="text-lg font-bold text-green-600">
                    Rp {rp.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
