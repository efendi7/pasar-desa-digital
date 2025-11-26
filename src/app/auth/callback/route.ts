import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/login?verified=true'

  if (code) {
    const supabase = createClient()
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect ke login dengan flag verified
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
    
    // Jika ada error saat exchange code
    console.error('Error exchanging code:', error)
    return NextResponse.redirect(
      new URL('/login?error=verification_failed', requestUrl.origin)
    )
  }

  // Jika tidak ada code parameter
  return NextResponse.redirect(
    new URL('/login?error=no_code', requestUrl.origin)
  )
}