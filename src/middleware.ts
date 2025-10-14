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

  // 🚫 Jika belum login & coba buka dashboard → redirect ke /login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🔒 Jika sudah login tapi coba buka login/register → redirect ke dashboard
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ✅ Cek profil user
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active, role')
      .eq('id', user.id)
      .single();

    // 🚧 Jika belum aktif dan bukan admin → redirect ke waiting-approval
    if (
      profile &&
      profile.role !== 'admin' &&
      profile.is_active === false &&
      !request.nextUrl.pathname.startsWith('/waiting-approval')
    ) {
      return NextResponse.redirect(new URL('/waiting-approval', request.url));
    }

    // 🟢 Jika user aktif & sedang di waiting-approval → kembalikan ke dashboard
    if (
      profile &&
      profile.is_active === true &&
      request.nextUrl.pathname.startsWith('/waiting-approval')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

// Middleware aktif untuk route berikut
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/waiting-approval', // tambahkan agar halaman ini bisa dilewati
  ],
};
