'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetailPage() {
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClient();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    // Load product with owner profile
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*, profiles(full_name, store_name, store_description, whatsapp_number), categories(name, slug)')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !productData) {
      setError('Produk tidak ditemukan');
      setLoading(false);
      return;
    }

    setProduct(productData);

    // Increment views
    await supabase
      .from('products')
      .update({ views: (productData.views || 0) + 1 })
      .eq('id', productId);

    // Load related products (same category)
    if (productData.category_id) {
      const { data: relatedData } = await supabase
        .from('products')
        .select('*, profiles(store_name)')
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

    const message = `Halo ${product.profiles.store_name}, saya tertarik dengan produk *${product.name}* seharga Rp ${product.price.toLocaleString('id-ID')}. Apakah masih tersedia?`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Memuat produk...</div>
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

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-green-600">Beranda</Link>
        {' > '}
        <Link href="/products" className="hover:text-green-600">Produk</Link>
        {product.categories && (
          <>
            {' > '}
            <Link href={`/category/${product.categories.slug}`} className="hover:text-green-600">
              {product.categories.name}
            </Link>
          </>
        )}
        {' > '}
        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-square bg-gray-200">
            {product.image_url ? (
              <img
                src={product.image_url}
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

        {/* Info */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          {product.categories && (
            <Link
              href={`/category/${product.categories.slug}`}
              className="inline-block mb-4 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200"
            >
              {product.categories.name}
            </Link>
          )}

          <div className="text-4xl font-bold text-green-600 mb-6">
            Rp {product.price.toLocaleString('id-ID')}
          </div>

          {product.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Deskripsi:</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Seller Info */}
          <div className="border-t pt-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Informasi Penjual:</h3>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl font-bold">
                {product.profiles.store_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <Link
                  href={`/umkm/${product.owner_id}`}
                  className="font-semibold text-gray-800 hover:text-green-600"
                >
                  {product.profiles.store_name}
                </Link>
                <p className="text-sm text-gray-500">
                  {product.profiles.full_name}
                </p>
              </div>
            </div>
            {product.profiles.store_description && (
              <p className="text-sm text-gray-600 mb-4">
                {product.profiles.store_description}
              </p>
            )}
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 text-lg"
          >
            <span className="text-2xl">💬</span>
            Hubungi Penjual via WhatsApp
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Klik tombol di atas untuk chat langsung dengan penjual
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Produk Serupa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {relatedProduct.image_url ? (
                    <img
                      src={relatedProduct.image_url}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-green-600">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {relatedProduct.profiles?.store_name}
                  </p>
                  <span className="text-lg font-bold text-green-600">
                    Rp {relatedProduct.price.toLocaleString('id-ID')}
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