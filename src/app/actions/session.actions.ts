'use server';
import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { clearTempSessionCookies } from '../../shared/lib/auth/sessionCookies';
import { redirect } from 'next/navigation';
import { createRedirectUrl } from '../../shared/utils/navigation/createRedirectUrl';
import { SESSION_EXPIRES_AT, SESSION_MODE } from '@/shared/domain/auth/constants';

export const resetTempSession = async () => {
  const cookieStore = await cookies();

  const mode = cookieStore.get(SESSION_MODE)?.value;
  if (mode !== 'temp') return;

  const nextExpiresAt = Date.now() + 2 * 60 * 60 * 1000; // 지금부터 2시간

  cookieStore.set(SESSION_MODE, 'temp', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  cookieStore.set(SESSION_EXPIRES_AT, String(nextExpiresAt), {
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
