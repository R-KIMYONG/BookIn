import { isValidPassword } from '@/app/lib/validation/isPassword';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest) => {
  let password: unknown;

  try {
    const body = await req.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  if (typeof password !== 'string') return NextResponse.json({ message: '비밀번호를 입력해주세요.' }, { status: 400 });

  if (!password) return NextResponse.json({ message: '비밀번호를 입력해주세요' }, { status: 400 });

  if (!isValidPassword(password))
    return NextResponse.json({ message: '비밀번호 형식이 맞지않습니다.' }, { status: 400 });

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user)
    return NextResponse.json({ message: '세션이 만료되었습니다. 다시 로그인 해주세요.' }, { status: 401 });

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    if (error.message === 'New password should be different from the old password.') {
      return NextResponse.json({ message: '이전 비밀번호와 다른 비밀번호를 입력해주세요.' }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: '비밀번호가 변경되었습니다.' }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  let password: unknown;

  try {
    const body = await req.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  if (typeof password !== 'string' || !password.trim())
    return NextResponse.json({ message: '현재 비밀번호를 입력해주세요.' }, { status: 400 });

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !user.email)
    return NextResponse.json({ message: '세션이 만료되었습니다. 다시 로그인 해주세요.' }, { status: 401 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const tokenResp = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: anonKey },
    body: JSON.stringify({ email: user.email, password: password.trim() }),
  });

  if (!tokenResp.ok) return NextResponse.json({ message: '현재 비밀번호가 올바르지 않습니다.' }, { status: 400 });

  return NextResponse.json({ message: '현재 비밀번호가 확인되었습니다.' }, { status: 200 });
};
