// app/(public)/store/page.tsx
import StoresClient from './StoresClient';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = createClient();
  const { data: stores } = await supabase.from('profiles').select(`
    id, store_name, full_name, store_description, avatar_url, cover_image_url,
    whatsapp_number, dusun:dusun_id ( name, slug ),
    products ( id, views )
  `);

  // PERBAIKAN: Transformasi data di sini
  const storesWithCount =
    stores?.map((s) => {
      // 1. Destructure untuk memisahkan products dan dusun
      const { products, dusun, ...rest } = s;

      return {
        ...rest, // Ambil sisa properti (id, store_name, dll)
        
        // 2. Perbaiki mismatch tipe 'dusun'
        // Ambil objek pertama dari array, atau null jika tidak ada
        dusun: Array.isArray(dusun) ? dusun[0] || null : dusun,

        // 3. Hitung _count
        _count: {
          products: products.length,
          total_views: products.reduce((a, b) => a + (b.views || 0), 0),
        },
        // Array 'products' tidak lagi dimasukkan ke objek akhir,
        // sehingga cocok dengan interface 'StoreData' di client
      };
    }) || [];

  const { data: dusuns } = await supabase.from('dusun').select('id, name, slug');

  return (
    <StoresClient
      initialStores={storesWithCount}
      initialDusuns={dusuns || []}
    />
  );
}