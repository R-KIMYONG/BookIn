import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_EXPIRES_AT, SESSION_MODE } from '@/shared/domain/auth/constants';

export const setTempSessionCookies = async () => {
  const cookieStore = await cookies();
  const maxAge = 2 * 60 * 60;
  const expiresAt = Date.now() + maxAge * 1000;

  cookieStore.set(SESSION_MODE, 'temp', {
    path: '/',
    maxAge,
    sameSite: 'lax',
    httpOnly: true,
  });

  cookieStore.set(SESSION_EXPIRES_AT, String(expiresAt), {
    path: '/',
    maxAge,
    sameSite: 'lax',
    httpOnly: false,
  });
};

export const clearTempSessionCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_MODE);
  cookieStore.delete(SESSION_EXPIRES_AT);
};
