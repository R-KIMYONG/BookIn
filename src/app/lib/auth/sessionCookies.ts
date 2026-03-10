import { cookies } from 'next/headers';

export const setTempSessionCookies = () => {
  const cookieStore = cookies();
  const maxAge = 2 * 60 * 60;
  const expiresAt = Date.now() + maxAge * 1000;

  cookieStore.set('bookin_session_mode', 'temp', {
    path: '/',
    maxAge,
    sameSite: 'lax',
    httpOnly: true,
  });

  cookieStore.set('bookin_session_expires_at', String(expiresAt), {
    path: '/',
    maxAge,
    sameSite: 'lax',
    httpOnly: true,
  });
};

export const clearTempSessionCookies = () => {
  const cookieStore = cookies();
  cookieStore.delete('bookin_session_mode');
  cookieStore.delete('bookin_session_expires_at');
};
