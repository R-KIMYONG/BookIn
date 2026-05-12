import { hashToken } from '@/shared/lib/crypto/hashToken';
import { clearPasswordResetState } from '@/shared/lib/supabase/users';
import { isValidEmail } from '@/shared/utils/validation/isEmail';
import { RESEND_COOLDOWN_MS, RESET_PASSWORD_EXPIRES_MS } from '@/shared/constants/auth';
import { createClient } from '@/shared/lib/supabase/server';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetMail } from '@/shared/lib/mail/sendPasswordResetMail';

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();

  const { email } = await request.json();

  if (!email || typeof email !== 'string')
    return NextResponse.json({ message: '이메일을 입력해주세요.' }, { status: 400 });

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) return NextResponse.json({ message: '이메일을 입력해주세요.' }, { status: 400 });

  if (!isValidEmail(normalizedEmail))
    return NextResponse.json({ message: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });

  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('id,password_reset_expires_at')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existingUserError) return NextResponse.json({ message: '요청 처리 중 오류가 발생했습니다.' }, { status: 500 });
  //이메일 존재여부를 숨겸
  if (!existingUser)
    return NextResponse.json(
      { message: '비밀번호 재설정 안내 메일을 발송했습니다. 메일함을 확인해주세요.' },
      { status: 200 }
    );

  const now = Date.now();

  //요청한지 1분이내 재요청한경우
  const isExpired =
    existingUser.password_reset_expires_at && new Date(existingUser.password_reset_expires_at).getTime() <= now;

  if (existingUser.password_reset_expires_at && !isExpired) {
    const lastRequestTime = new Date(existingUser.password_reset_expires_at).getTime() - RESET_PASSWORD_EXPIRES_MS;

    if (now - lastRequestTime < RESEND_COOLDOWN_MS) {
      return NextResponse.json({ message: '요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.' }, { status: 429 });
    }
  }

  const rawToken = randomUUID();
  const tokenHash = hashToken(rawToken);
  const origin = request.nextUrl.origin;

  const params = new URLSearchParams({ token: rawToken });

  const confirmUrl = `${origin}/reset-password?${params.toString()}`;

  const { error: publicError } = await supabase
    .from('users')
    .update({
      password_reset_email: normalizedEmail,
      password_reset_expires_at: new Date(now + RESET_PASSWORD_EXPIRES_MS).toISOString(),
      password_reset_token_hash: tokenHash,
    })
    .eq('id', existingUser.id);

  if (publicError) {
    return NextResponse.json({ message: '요청 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }

  try {
    await sendPasswordResetMail({
      email: normalizedEmail,
      confirmUrl,
    });
  } catch (error) {
    //오류나면 update한 데이터를 reset
    const { error: clearPendingError } = await clearPasswordResetState(supabase, existingUser.id);

    if (clearPendingError) return NextResponse.json({ message: clearPendingError.message }, { status: 500 });

    return NextResponse.json(
      { message: error instanceof Error ? error.message : '인증 메일 발송에 실패했습니다.' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: '비밀번호 재설정 안내 메일을 발송했습니다. 메일함을 확인해주세요.' },
    { status: 200 }
  );
};
