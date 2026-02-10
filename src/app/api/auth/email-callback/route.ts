import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/auth/email-confirmed';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = createClient();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!userError && user) {
    const newEmail = user.email ?? null;
    if (newEmail) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ email: newEmail })
        .eq('id', user.id);
      if (updateError) {
        console.error('[callback] public.users email sync failed:', updateError);
      }
    }
  }
  return NextResponse.redirect(`${origin}${next}`);
}