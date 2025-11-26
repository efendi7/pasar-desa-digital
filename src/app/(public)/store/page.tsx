// app/(public)/store/page.tsx
import StoresClient from './StoresClient';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = createClient();
  
  // Tambahkan role dan is_admin di SELECT, plus filter admin di query
  const { data: stores } = await supabase
    .from('profiles')
    .select(`
      id, store_name, full_name, store_description, avatar_url, cover_image_url,
      whatsapp_number, role, is_admin,
      dusun:dusun_id ( name, slug ),
      products ( id, views )
    `)
    .eq('is_active', true)           // Hanya toko aktif
    .neq('role', 'admin')             // ❌ Exclude role admin
    .neq('is_admin', true);           // ❌ Exclude is_admin true

  // Transformasi data
  const storesWithCount =
    stores?.map((s) => {
      // Destructure untuk memisahkan products dan dusun
      const { products, dusun, ...rest } = s;

      return {
        ...rest, // Ambil sisa properti (id, store_name, role, is_admin, dll)
        
        // Perbaiki mismatch tipe 'dusun'
        dusun: Array.isArray(dusun) ? dusun[0] || null : dusun,

        // Hitung _count
        _count: {
          products: products.length,
          total_views: products.reduce((a, b) => a + (b.views || 0), 0),
        },
      };
    }) || [];

  const { data: dusuns } = await supabase
    .from('dusun')
    .select('id, name, slug');

  return (
    <StoresClient
      initialStores={storesWithCount}
      initialDusuns={dusuns || []}
    />
  );
}