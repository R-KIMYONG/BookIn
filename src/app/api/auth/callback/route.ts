import { NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { createRedirectUrl } from '@/shared/utils/navigation/createRedirectUrl';

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get('code');

  const next = searchParams.get('next') ?? '/';

  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/';

  const supabase = await createClient();
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const providers = data.session?.user?.app_metadata?.providers ?? [];
      const redirectUrl = createRedirectUrl(safeNext, {
        toast: RESULT_CODE.AUTH_SOCIAL_LOGIN_SUCCESS,
        provider: providers.join(','),
      });
      return NextResponse.redirect(`${origin}${redirectUrl}`);
    }
  }
  const redirectUrl = createRedirectUrl('/login', {
    toast: RESULT_CODE.AUTH_SOCIAL_LOGIN_FAILED,
  });

  return NextResponse.redirect(`${origin}${redirectUrl}`);
};
