'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { clearTempSessionCookies, setTempSessionCookies } from '../../shared/lib/auth/sessionCookies';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { ActionResult } from '@/shared/lib/message/actionResult';
import { User } from '@supabase/supabase-js';
import { getBaseUrl } from '@/shared/lib/network/getBaseUrl';
import { SocialProvider } from '@/components/common/ui/Button/type';
import { isValidPassword } from '@/shared/utils/validation/isPassword';

export const logout = async (formData: FormData): Promise<ActionResult<{ redirectTo: string }>> => {
  const supabase = await createClient();
  const next = String(formData.get('next') ?? '/');
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, code: RESULT_CODE.AUTH_LOGOUT_FAILED };
  }
  const isSafePath = next.startsWith('/') && !next.startsWith('//');
  clearTempSessionCookies();
  revalidatePath('/', 'layout');
  const successPath = isSafePath && next !== '/mypage' ? next : '/';
  return {
    ok: true,
    code: RESULT_CODE.AUTH_LOGOUT_SUCCESS,
    data: { redirectTo: successPath },
  };
};

export const login = async (formData: FormData): Promise<ActionResult<{ user: User; redirectTo: string }>> => {
  const supabase = await createClient();
  const remember = formData.get('remember') === 'on';
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirectTo') ?? '/').trim();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      ok: false,
      code: RESULT_CODE.AUTH_LOGIN_FAILED,
    };
  }
  if (remember) {
    clearTempSessionCookies();
  } else {
    setTempSessionCookies();
  }
  revalidatePath('/', 'layout');

  const nextPath = redirectTo !== '' && redirectTo !== '/login' ? redirectTo : '/mypage';

  return {
    ok: true,
    code: RESULT_CODE.AUTH_LOGIN_SUCCESS,
    data: {
      user: data.user,
      redirectTo: nextPath,
    },
  };
};

export const signInWithOAuth = async (formData: FormData) => {
  const supabase = await createClient();

  const provider = formData.get('provider') as SocialProvider;

  const next = String(formData.get('next') ?? '/');

  const baseUrl = await getBaseUrl();

  const callbackUrl = `${baseUrl}/api/auth/callback?next=${next}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl,
    },
  });
  if (error || !data.url) {
    throw error;
  }
  redirect(data.url);
};

export const signup = async (formData: FormData): Promise<ActionResult<{ user: User; redirectTo: string }>> => {
  const supabase = await createClient();

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');
  const nickname = String(formData.get('nickname') ?? '').trim();

  const redirectTo = String(formData.get('redirectTo') ?? '/').trim();

  if (!nickname) {
    return {
      ok: false,
      code: RESULT_CODE.VALIDATION_REQUIRED_NICKNAME,
    };
  }
  if (!isValidPassword(password)) {
    return {
      ok: false,
      code: RESULT_CODE.VALIDATION_INVALID_PASSWORD,
    };
  }

  if (password !== confirmPassword) {
    return {
      ok: false,
      code: RESULT_CODE.VALIDATION_PASSWORD_MISMATCH,
    };
  }

  // 이메일 중복 체크
  const { data: emailExist, error: emailCheckError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (emailCheckError) {
    console.error(emailCheckError);
    return {
      ok: false,
      code: RESULT_CODE.COMMON_SERVER_ERROR,
    };
  }

  if (emailExist) {
    return {
      ok: false,
      code: RESULT_CODE.AUTH_EMAIL_ALREADY_EXISTS,
    };
  }

  // 닉네임 중복 체크
  const { data: nicknameExist, error: nicknameCheckError } = await supabase
    .from('users')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle();

  if (nicknameCheckError) {
    console.error(nicknameCheckError);
    return {
      ok: false,
      code: RESULT_CODE.COMMON_SERVER_ERROR,
    };
  }

  if (nicknameExist) {
    return { ok: false, code: RESULT_CODE.AUTH_NICKNAME_ALREADY_EXISTS };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname, avatar: '' },
    },
  });

  if (error || !data.user?.id) {
    console.error(error);
    return { ok: false, code: RESULT_CODE.COMMON_SERVER_ERROR };
  }

  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) {
    console.error(loginError);
    return { ok: false, code: RESULT_CODE.AUTH_AUTO_LOGIN_FAILED, data: { redirectTo: '/login' } };
  }

  setTempSessionCookies();

  revalidatePath('/', 'layout');
  return {
    ok: true,
    code: RESULT_CODE.AUTH_SIGNUP_SUCCESS,
    data: {
      user: data.user,
      redirectTo: redirectTo,
    },
  };
};

export const deleteAccount = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      code: RESULT_CODE.AUTH_REQUIRED_LOGIN,
    };
  }

  const userId = user.id;

  const possibleFiles = [
    `${userId}/avatar.jpg`,
    `${userId}/avatar.jpeg`,
    `${userId}/avatar.png`,
    `${userId}/avatar.gif`,
    `${userId}/avatar.webp`,
  ];
  const { error: avatarError } = await supabase.storage.from('avatars').remove(possibleFiles);

  if (avatarError) {
    console.error(avatarError);
  }

  const { error: rpcError } = await supabase.rpc('delete_user', {
    user_id: userId,
  });

  if (rpcError) {
    console.error(rpcError);
    return {
      ok: false,
      code: RESULT_CODE.AUTH_DELETE_FAILED,
    };
  }
  clearTempSessionCookies();
  revalidatePath('/', 'layout');
  return {
    ok: true,
    code: RESULT_CODE.AUTH_DELETE_SUCCESS,
  };
};
