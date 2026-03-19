'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { clearTempSessionCookies, setTempSessionCookies } from '../lib/auth/sessionCookies';
import { isValidEmail } from '../lib/validation/isEmail';
import { isValidPassword } from '../lib/validation/isPassword';
import { AUTH_CODE } from '../lib/auth/authActionFeedback';

export const logout = async (formData: FormData) => {
  const supabase = createClient();
  const next = String(formData.get('next') ?? '/');
  const { error } = await supabase.auth.signOut();

  const buildRedirectUrl = (path: string, key: 'error' | 'message', value: string) => {
    const url = new URL(path, 'http://example.com');
    url.searchParams.set(key, value);
    return `${url.pathname}${url.search}`;
  };

  if (error) {
    redirect(`${next}?error=${AUTH_CODE.logout.FAILED}`);
  }
  clearTempSessionCookies();
  revalidatePath('/', 'layout');

  const successPath = next === '/mypage' ? '/' : next;
  redirect(buildRedirectUrl(successPath, 'message', AUTH_CODE.logout.SUCCESS));
};

export const logoutExpiredSession = async (redirectTo: string) => {
  const supabase = createClient();
  await supabase.auth.signOut();
  clearTempSessionCookies();
  revalidatePath('/', 'layout');
  redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
};

export const login = async (formData: FormData) => {
  const supabase = createClient();
  const remember = formData.get('remember') === 'on';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirectTo') ?? '/').trim();
  if (!email || !password) {
    // 여기서 redirect로 에러 페이지 보내도 되고,
    // login 페이지에서 query param으로 처리해도 됨.
    redirect(`/login?error=${AUTH_CODE.login.EMPTY}`);
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${AUTH_CODE.login.INVALID}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  if (remember) {
    clearTempSessionCookies();
  } else {
    setTempSessionCookies();
  }
  revalidatePath('/', 'layout');

  const nextPath = redirectTo === '/' || redirectTo === '' ? '/mypage' : redirectTo;
  redirect(nextPath);
};

export const signup = async (formData: FormData) => {
  const supabase = createClient();

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  const nickname = String(formData.get('nickname') ?? '').trim();

  if (!email || !password || !confirmPassword || !nickname) redirect(`/signup?error=${AUTH_CODE.signup.EMPTY}`);

  if (!isValidEmail(email)) redirect(`/signup?error=${AUTH_CODE.signup.EMAIL_INVALID}`);

  if (!isValidPassword(password)) redirect(`/signup?error=${AUTH_CODE.signup.PASSWORD_INVALID}`);

  if (password !== confirmPassword) redirect(`/signup?error=${AUTH_CODE.signup.PASSWORD_MISMATCH}`);

  // 이메일 중복 체크
  const { data: emailExist, error: emailCheckError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (emailCheckError) {
    console.error(emailCheckError);
    redirect(`/signup?error=${AUTH_CODE.common.UNKNOWN}`);
  }

  if (emailExist) redirect(`/signup?error=${AUTH_CODE.signup.EMAIL_EXISTS}`);

  // 닉네임 중복 체크
  const { data: nicknameExist, error: nicknameCheckError } = await supabase
    .from('users')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle();

  if (nicknameCheckError) {
    console.error(nicknameCheckError);
    redirect(`/signup?error=${AUTH_CODE.common.UNKNOWN}`);
  }

  if (nicknameExist) redirect(`/signup?error=${AUTH_CODE.signup.NICKNAME_EXISTS}`);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
    },
  });

  if (error || !data.user?.id) redirect(`/signup?error=${AUTH_CODE.signup.AUTH_FAILED}`);

  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) redirect(`/signup?error=${AUTH_CODE.signup.AUTH_FAILED}`);

  const userId = data.user.id;

  const { error: insertError } = await supabase.from('users').insert({
    id: userId,
    email,
    nickname,
  });

  if (insertError) redirect(`/signup?error=${AUTH_CODE.signup.PROFILE_FAILED}`);

  setTempSessionCookies();

  revalidatePath('/', 'layout');
  redirect('/mypage');
};

export const deleteAccount = async () => {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/login?error=${AUTH_CODE.login.UNAUTHORIZED}`);
  }

  const userId = user.id;

  const possibleFiles = [
    `${userId}/avatar.jpg`,
    `${userId}/avatar.jpeg`,
    `${userId}/avatar.png`,
    `${userId}/avatar.gif`,
  ];
  const { error: avatarError } = await supabase.storage.from('avatars').remove(possibleFiles);

  if (avatarError) {
    console.error(avatarError);
  }

  const { error: publicError } = await supabase.from('users').delete().eq('id', userId);

  if (publicError) {
    console.error(publicError);
    redirect(`/mypage?error=${AUTH_CODE.delete.USER_FAILED}`);
  }

  const { error: rpcError } = await supabase.rpc('delete_user', {
    user_id: userId,
  });

  if (rpcError) {
    console.error(rpcError);
    redirect(`/mypage?error=${AUTH_CODE.delete.AUTH_FAILED}`);
  }
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    console.error(signOutError);
  }
  clearTempSessionCookies();
  revalidatePath('/', 'layout');
  revalidatePath('/mypage', 'page');
  redirect(`/?message=${AUTH_CODE.delete.SUCCESS}`);
};

export const resetTempSession = async () => {
  const cookieStore = cookies();

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
    httpOnly: true,
    sameSite: 'lax',
  });

  revalidatePath('/', 'layout');
};
