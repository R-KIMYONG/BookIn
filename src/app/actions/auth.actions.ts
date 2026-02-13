'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}


export async function login(formData: FormData) {
  const supabase = createClient();

  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirectTo') ?? '/').trim();

   if (!email || !password) {
    // 여기서 redirect로 에러 페이지 보내도 되고,
    // login 페이지에서 query param으로 처리해도 됨.
    redirect(`/login?error=empty`);
  }

  const { error } = await supabase.auth.signInWithPassword({email, password});

  if (error) {
    redirect(`/login?error=invalid`);
  }

  revalidatePath('/', 'layout');

  if (redirectTo === '/' || redirectTo === '') redirect('/mypage');
  redirect(redirectTo);
}
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (pw: string) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pw);

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
  const { data: emailExist } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (emailExist) redirect('/signup?error=email-exists');
  

  // 닉네임 중복 체크
  const { data: nicknameExist } = await supabase
    .from('users')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle();

  if (nicknameExist) redirect('/signup?error=nickname-exists');
  

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
    },
  });

  if (error || !data.user?.id) redirect('/signup?error=auth');



  const { error: loginError } = await supabase.auth.signInWithPassword({email,password});
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