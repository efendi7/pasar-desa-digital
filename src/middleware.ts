import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Jika user belum login dan mencoba mengakses halaman dashboard
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika user sudah login dan mencoba mengakses halaman login/register
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

// Tentukan path mana saja yang akan dijalankan oleh middleware
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};