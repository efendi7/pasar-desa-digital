import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 1. Jadikan fungsi 'get' menjadi async
        get: async (name: string) => {
          // 2. Gunakan 'await' saat memanggil method dari cookieStore
          return (await cookieStore).get(name)?.value;
        },
        // 3. Jadikan fungsi 'set' menjadi async
        set: async (name: string, value: string, options: CookieOptions) => {
          try {
            // 4. Gunakan 'await' di sini juga
            (await cookieStore).set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        // 5. Jadikan fungsi 'remove' menjadi async
        remove: async (name: string, options: CookieOptions) => {
          try {
            // 6. Gunakan 'await' di sini juga
            (await cookieStore).set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  );
}