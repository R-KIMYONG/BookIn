import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // supabaseResponse = NextResponse.next({request,});
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const protectedPaths = ['/mypage'];
  const authPages = ['/login', '/signup', '/terms'];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPages.some((p) => pathname.startsWith(p));

  const mode = request.cookies.get('bookin_session_mode')?.value;
  const expiresStr = request.cookies.get('bookin_session_expires_at')?.value;

  if (mode === 'temp' && expiresStr) {
    const expiresAt = Number(expiresStr);
    const isExpired = !Number.isFinite(expiresAt) || Date.now() >= expiresAt;

    if (isExpired) {
      supabaseResponse.cookies.delete('bookin_session_mode');
      supabaseResponse.cookies.delete('bookin_session_expires_at');
      await supabase.auth.signOut();

      if (isProtected) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('reason', 'expired');
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
      }

      return supabaseResponse;
    }
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/mypage';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return supabaseResponse;
}
