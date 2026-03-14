'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { clearTempSessionCookies, setTempSessionCookies } from '../lib/auth/sessionCookies';
import { isValidEmail } from '../lib/validation/isEmail';
import { isValidPassword } from '../lib/validation/isPassword';

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error');
  }

  clearTempSessionCookies();

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function login(formData: FormData) {
  const supabase = createClient();
  const remember = formData.get('remember') === 'on';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirectTo') ?? '/').trim();
  if (!email || !password) {
    // 여기서 redirect로 에러 페이지 보내도 되고,
    // login 페이지에서 query param으로 처리해도 됨.
    redirect(`/login?error=empty`);
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=invalid`);
  }

  if (remember) {
    clearTempSessionCookies();
  } else {
    setTempSessionCookies();
  }
  revalidatePath('/', 'layout');

  const nextPath = redirectTo === '/' || redirectTo === '' ? '/mypage' : redirectTo;
  redirect(nextPath);
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  const nickname = String(formData.get('nickname') ?? '').trim();

  if (!email || !password || !confirmPassword || !nickname) redirect('/signup?error=empty');
  if (!isValidEmail(email)) redirect('/signup?error=email');
  if (!isValidPassword(password)) redirect('/signup?error=password');
  if (password !== confirmPassword) redirect('/signup?error=password-mismatch');

  // 이메일 중복 체크
  const { data: emailExist } = await supabase.from('users').select('id').eq('email', email).maybeSingle();

  if (emailExist) redirect('/signup?error=email-exists');

  // 닉네임 중복 체크
  const { data: nicknameExist } = await supabase.from('users').select('id').eq('nickname', nickname).maybeSingle();

  if (nicknameExist) redirect('/signup?error=nickname-exists');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
    },
  });

  if (error || !data.user?.id) redirect('/signup?error=auth');

  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) redirect('/signup?error=auth');

  const userId = data.user.id;

  const { error: insertError } = await supabase.from('users').insert({
    id: userId,
    email,
    nickname,
  });

  if (insertError) redirect('/signup?error=profile');

  revalidatePath('/', 'layout');
  redirect('/mypage');
}

export async function deleteAccount() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: 'not authenticated' };
  }

  const userId = user.id;

  const { error: publicError } = await supabase.from('users').delete().eq('id', userId);

  if (publicError) {
    return { ok: false, error: publicError.message };
  }

  const { error: rpcError } = await supabase.rpc('delete_user', {
    user_id: userId,
  });

  if (rpcError) {
    return { ok: false, error: rpcError.message };
  }
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  revalidatePath('/mypage', 'page');
  return { ok: true };
}
export async function resetTempSession() {
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
}
