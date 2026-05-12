import { hashToken } from '@/shared/lib/crypto/hashToken';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { consumePasswordResetToken } from '@/shared/lib/supabase/passwordReset';
import { isValidPassword } from '@/shared/utils/validation/isPassword';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { password, token } = body;

  if (!password || !token) return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });

  if (!isValidPassword(password))
    return NextResponse.json({ message: '비밀번호 형식이 맞지않습니다.' }, { status: 400 });

  const tokenHash = hashToken(token);

  const { data: consumedUser, error } = await consumePasswordResetToken(supabase, tokenHash);

  if (error) {
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }

  if (!consumedUser) {
    return NextResponse.json({ message: '링크가 만료되었거나 유효하지 않습니다.' }, { status: 403 });
  }
  // 비밀번호 변경 (admin API 사용)
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(consumedUser.id, {
    password,
  });
  if (updateError) return NextResponse.json({ message: '비밀번호 변경 실패' }, { status: 500 });

  return NextResponse.json({ message: '비밀번호가 변경되었습니다.' });
};

export const DELETE = async (request: NextRequest) => {
  const supabase = await createClient();

  const { token } = await request.json();
  if (!token) return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });

  const tokenHash = hashToken(token);

  const { data: consumedUser, error } = await consumePasswordResetToken(supabase, tokenHash);

  if (error)
    return NextResponse.json({ message: '비밀번호 재설정 요청 처리 중 오류가 발생했습니다.' }, { status: 500 });

  if (!consumedUser) return NextResponse.json({ message: '유효하지 않거나 만료된 요청입니다.' }, { status: 400 });

  return NextResponse.json({ message: '비밀번호 재설정 요청 취소 완료' }, { status: 200 });
};
