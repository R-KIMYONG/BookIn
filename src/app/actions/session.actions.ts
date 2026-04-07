'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { clearTempSessionCookies } from '../lib/auth/sessionCookies';
import { redirect } from 'next/navigation';
import { createRedirectUrl } from '../lib/navigation/createRedirectUrl';

export const resetTempSession = async () => {
  const cookieStore = await cookies();

  const mode = cookieStore.get('bookin_session_mode')?.value;
  if (mode !== 'temp') return;

  const nextExpiresAt = Date.now() + 2 * 60 * 60 * 1000; // 지금부터 2시간

  cookieStore.set('bookin_session_mode', 'temp', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  cookieStore.set('bookin_session_expires_at', String(nextExpiresAt), {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
  });

  revalidatePath('/', 'layout');
};

export const logoutExpiredSession = async ({
  redirectTo,
  shouldRedirectToLogin,
}: {
  redirectTo?: string;
  shouldRedirectToLogin: boolean;
}) => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  clearTempSessionCookies();
  revalidatePath('/', 'layout');

  if (shouldRedirectToLogin && redirectTo) {
    redirect(createRedirectUrl('/login', { redirectTo }));
  }
};
