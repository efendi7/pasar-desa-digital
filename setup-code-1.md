
Dokumen ini memandu pembuatan fondasi aplikasi **"Pasar Desa Digital"** menggunakan Next.js dan Supabase. Panduan ini mencakup persiapan proyek, koneksi database, implementasi otentikasi, dan cara menampilkan data.

Fennunnes247Oke_

-----

### \#\# Langkah 1: Persiapan Proyek 🛠️

Langkah pertama adalah menyiapkan lingkungan pengembangan dan membuat proyek Next.js baru.

**Prasyarat:**

  * **Node.js**: Terpasang di komputer Anda.
  * **Akun Supabase**: Proyek baru telah dibuat di [supabase.com](https://supabase.com).
  * **Text Editor**: Visual Studio Code (direkomendasikan).
  * **Git & GitHub**: Untuk version control dan deployment.

**Inisialisasi Proyek:**
Jalankan perintah berikut di terminal Anda untuk membuat proyek Next.js dengan konfigurasi yang direkomendasikan.

```bash
npx create-next-app@latest pasar-desa-digital
```

Gunakan opsi berikut saat instalasi:

  * TypeScript? **Yes**
  * ESLint? **Yes**
  * Tailwind CSS? **Yes**
  * `src/` directory? **Yes**
  * App Router? **Yes**
  * Customize default import alias? **No**

Setelah selesai, navigasikan ke direktori proyek dan jalankan server pengembangan.

```bash
cd pasar-desa-digital
pnpm dev
```

Buka `http://localhost:3000` di browser Anda untuk memastikan halaman default Next.js berhasil dimuat.

-----

### \#\# Langkah 2: Koneksi ke Supabase 🔗

Selanjutnya, hubungkan aplikasi Anda ke Supabase menggunakan paket `@supabase/ssr` yang modern.

1.  **Instal Library Supabase:**
    Hentikan server (Ctrl + C) dan instal paket yang diperlukan.

    ```bash
    pnpm add @supabase/ssr
    ```

2.  **Konfigurasi Environment Variables:**
    Dapatkan **Project URL** dan **anon public Key** dari dashboard Supabase Anda di `Settings > API`. Buat file `.env.local` di root proyek dan isi dengan kredensial Anda.

    ```
    NEXT_PUBLIC_SUPABASE_URL=URL_PROYEK_ANDA
    NEXT_PUBLIC_SUPABASE_ANON_KEY=KUNCI_ANON_PUBLIK_ANDA
    ```

3.  **Buat Supabase Client Utilities:**
    Paket `@supabase/ssr` memerlukan dua file utilitas untuk menangani otentikasi di sisi server dan client. Buat folder `src/utils/supabase`.

      * **Buat `src/utils/supabase/client.js`** (untuk Client Components):

        ```javascript
        import { createBrowserClient } from '@supabase/ssr'

        export function createClient() {
          return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          )
        }
        ```

      * **Buat `src/utils/supabase/server.js`** (untuk Server Components & Actions):

        ```javascript
        import { createServerClient } from '@supabase/ssr'
        import { cookies } from 'next/headers'

        export function createClient() {
          const cookieStore = cookies()
          return createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
              cookies: {
                get(name) {
                  return cookieStore.get(name)?.value
                },
              },
            }
          )
        }
        ```

-----

### \#\# Langkah 3: Fitur Otentikasi 🔐

Implementasikan fungsi daftar dan login pengguna.

1.  **Siapkan Tabel `profiles` di Supabase:**
    Buka **SQL Editor** di dashboard Supabase dan jalankan skrip berikut untuk membuat tabel `profiles`, mengaktifkan RLS, dan membuat *trigger* yang secara otomatis menyalin data pengguna baru.

    ```sql
    -- Membuat tabel profiles
    CREATE TABLE public.profiles (
      id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
      full_name text,
      store_name text,
      store_description text,
      whatsapp_number text,
      is_active boolean DEFAULT true
    );
    -- Mengaktifkan Row Level Security
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    -- Menambahkan policies untuk akses data
    CREATE POLICY "User can view and update their own profile." ON public.profiles FOR ALL USING (auth.uid() = id);
    -- Fungsi dan trigger untuk menyinkronkan user baru
    CREATE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, full_name)
      VALUES (new.id, new.raw_user_meta_data->>'full_name');
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    ```

2.  **Buat Halaman Login:**
    Buat file `src/app/login/page.js`. Halaman ini adalah **Client Component** (`'use client'`) karena memerlukan interaktivitas pengguna.

    ```jsx
    'use client';
    import { useState } from 'react';
    import { createClient } from '@/utils/supabase/client';

    export default function LoginPage() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const supabase = createClient();

      const handleSignUp = async () => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: 'Pengguna Baru' } },
        });
        if (error) alert(error.message);
        else alert('Pendaftaran berhasil, cek email untuk verifikasi!');
      };

      const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else {
          alert('Login berhasil!');
          // Redirect ke dashboard, contoh: window.location.href = '/dashboard';
        }
      };

      return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
          <h1>Login / Daftar</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '20px' }} />
          <button onClick={handleLogin} style={{ marginRight: '10px' }}>Login</button>
          <button onClick={handleSignUp}>Daftar</button>
        </div>
      );
    }
    ```

-----

### \#\# Langkah 4: Menampilkan Data 📊

Buat halaman untuk menampilkan daftar produk. Halaman ini akan kita buat sebagai **Server Component** untuk performa yang lebih baik.

1.  **Siapkan Tabel `categories` dan `products`:**
    Jalankan skrip SQL berikut untuk membuat tabel yang dibutuhkan beserta RLS-nya.

    ```sql
    -- Tabel Kategori
    CREATE TABLE public.categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text UNIQUE NOT NULL
    );
    -- Tabel Produk
    CREATE TABLE public.products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id uuid NOT NULL REFERENCES public.profiles(id),
      category_id uuid REFERENCES public.categories(id),
      name text NOT NULL,
      description text,
      price numeric NOT NULL,
      image_url text,
      created_at timestamptz DEFAULT now()
    );
    -- Aktifkan RLS dan atur policies
    ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read access" ON public.categories FOR SELECT USING (true);
    CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
    CREATE POLICY "Allow insert for authenticated users" ON public.products FOR INSERT WITH CHECK (auth.uid() = owner_id);
    CREATE POLICY "Allow update for owners" ON public.products FOR UPDATE USING (auth.uid() = owner_id);
    ```

    **Penting**: Isi beberapa data contoh (dummy) melalui **Table Editor** Supabase.

2.  **Buat Halaman Produk:**
    Buat file `src/app/products/page.js`. Kode ini mengambil data di sisi server sebelum halaman dikirim ke browser, sehingga lebih cepat dan SEO-friendly.

    ```jsx
    import { createClient } from '@/utils/supabase/server';
    import { cookies } from 'next/headers';

    export default async function ProductsPage() {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const { data: products } = await supabase.from('products').select(`
        id, name, price, profiles ( store_name )
      `);

      return (
        <div style={{ padding: '50px' }}>
          <h1>Katalog Produk Desa</h1>
          {products?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {products.map((product) => (
                <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px' }}>
                  <h3>{product.name}</h3>
                  <p>Harga: Rp {product.price}</p>
                  <p>Penjual: {product.profiles.store_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Belum ada produk yang tersedia.</p>
          )}
        </div>
      );
    }
    ```

-----

### \#\# Langkah Berikutnya ➡️

Fondasi aplikasi Anda telah siap. Berikutnya, Anda dapat fokus pada:

  * **CRUD Produk**: Bangun form untuk menambah, mengedit, dan menghapus produk menggunakan **Server Actions**.
  * **Routing Dinamis**: Buat halaman detail untuk setiap produk di `src/app/products/[id]/page.js`.
  * **Styling**: Manfaatkan **Tailwind CSS** untuk membangun antarmuka yang menarik dan responsif.
  * **Deployment**: Hubungkan repositori GitHub Anda ke **Vercel** untuk proses deployment yang otomatis.