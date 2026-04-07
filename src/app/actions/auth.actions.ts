'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { clearTempSessionCookies, setTempSessionCookies } from '../lib/auth/sessionCookies';
import { isValidEmail } from '../lib/validation/isEmail';
import { isValidPassword } from '../lib/validation/isPassword';
import { AUTH_CODE } from '../lib/auth/authActionFeedback';
import { createRedirectUrl } from '../lib/navigation/createRedirectUrl';

export const logout = async (formData: FormData) => {
  const supabase = await createClient();
  const next = String(formData.get('next') ?? '/');
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect(createRedirectUrl(next, { error: AUTH_CODE.logout.FAILED }));
  }
  clearTempSessionCookies();
  revalidatePath('/', 'layout');
  const successPath = next === '/mypage' ? '/' : next;
  redirect(createRedirectUrl(successPath, { message: AUTH_CODE.logout.SUCCESS }));
};

export const login = async (formData: FormData) => {
  const supabase = await createClient();
  const remember = formData.get('remember') === 'on';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirectTo') ?? '/').trim();
  if (!email || !password) {
    // 여기서 redirect로 에러 페이지 보내도 되고,
    // login 페이지에서 query param으로 처리해도 됨.
    redirect(createRedirectUrl('/login', { error: AUTH_CODE.login.EMPTY }));
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  

  if (error) {
    redirect(createRedirectUrl('/login', { error: AUTH_CODE.login.INVALID, redirectTo }));
  }

  if (remember) {
    clearTempSessionCookies();
  } else {
    setTempSessionCookies();
  }
  revalidatePath('/', 'layout');

  const nextPath = redirectTo && redirectTo !== '' && redirectTo !== '/login' ? redirectTo : '/mypage';

  redirect(nextPath);
};

export const signup = async (formData: FormData) => {
  const supabase = await createClient();

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  const nickname = String(formData.get('nickname') ?? '').trim();

  if (!email || !password || !confirmPassword || !nickname)
    redirect(createRedirectUrl('/signup', { error: AUTH_CODE.signup.EMPTY }));

  if (!isValidEmail(email)) redirect(createRedirectUrl('/signup', { error: AUTH_CODE.signup.EMAIL_INVALID }));

  if (!isValidPassword(password)) redirect(createRedirectUrl('/signup', { error: AUTH_CODE.signup.PASSWORD_INVALID }));

  if (password !== confirmPassword)
    redirect(createRedirectUrl('/signup', { error: AUTH_CODE.signup.PASSWORD_MISMATCH }));

  // 이메일 중복 체크
  const { data: emailExist, error: emailCheckError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (emailCheckError) {
    console.error(emailCheckError);
    redirect(createRedirectUrl('/signup', { error: AUTH_CODE.common.UNKNOWN }));
  }

  if (emailExist) redirect(createRedirectUrl('/signup', { error: AUTH_CODE.signup.EMAIL_EXISTS }));

  // 닉네임 중복 체크
  const { data: nicknameExist, error: nicknameCheckError } = await supabase
    .from('users')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle();

  if (nicknameCheckError) {
    console.error(nicknameCheckError);
    redirect(createRedirectUrl('/signup', { error: AUTH_CODE.common.UNKNOWN }));
  }

  if (nicknameExist) redirect(createRedirectUrl('/signup', { error: AUTH_CODE.signup.NICKNAME_EXISTS }));

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
    },
  });

  if (error || !data.user?.id) redirect(createRedirectUrl('/signup', { error: AUTH_CODE.signup.AUTH_FAILED }));

  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) redirect(createRedirectUrl('/signup', { error: AUTH_CODE.signup.AUTH_FAILED }));

  const userId = data.user.id;

  const { error: insertError } = await supabase.from('users').insert({
    id: userId,
    email,
    nickname,
  });

  if (insertError) redirect(createRedirectUrl('/signup', { error: AUTH_CODE.signup.PROFILE_FAILED }));

  setTempSessionCookies();

  revalidatePath('/', 'layout');
  redirect('/mypage');
};

export const deleteAccount = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(createRedirectUrl('/login', { error: AUTH_CODE.login.UNAUTHORIZED }));
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
    redirect(createRedirectUrl('/mypage', { error: AUTH_CODE.delete.USER_FAILED }));
  }

  const { error: rpcError } = await supabase.rpc('delete_user', {
    user_id: userId,
  });

  if (rpcError) {
    console.error(rpcError);
    redirect(createRedirectUrl('/mypage', { error: AUTH_CODE.delete.AUTH_FAILED }));
  }
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    console.error(signOutError);
  }
  clearTempSessionCookies();
  revalidatePath('/', 'layout');
  revalidatePath('/mypage', 'page');
  redirect(createRedirectUrl('/', { message: AUTH_CODE.delete.SUCCESS }));
};
