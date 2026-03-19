import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { sendEmailChangeMail } from '@/app/lib/mail/sendEmailChangeMail';
import { hashToken } from '@/app/lib/crypto/hashToken';
import { clearPendingEmail } from '@/app/lib/supabase/users';
import { isValidEmail } from '@/app/lib/validation/isEmail';

const EMAIL_CHANGE_EXPIRES_MS = 60 * 60 * 1000; //한시간으로 설정

export const PATCH = async (request: NextRequest) => {
  //1. 변경할 이메일 request에서 확보
  //2. 확보된 변경할 이메일을 검증
  //3. public.users테이블에 pending정보를 업데이트
  //4. 이후 인증메일을 발송(변경할 이메일 + redirectURL껴서 보내면됨)
  const supabase = createClient();
  const body = await request.json();
  const newEmail = String(body?.email ?? '')
    .trim()
    .toLowerCase();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError)
      return NextResponse.json({ message: '세션이 만료되었습니다. 다시 로그인 해주세요.' }, { status: 401 });

    if (!newEmail) return NextResponse.json({ message: '변경할 이메일을 입력해주세요.' }, { status: 400 });

    if (!isValidEmail(newEmail))
      return NextResponse.json({ message: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });

    if (user.email?.toLowerCase() === newEmail)
      return NextResponse.json({ message: '현재 사용 중인 이메일과 같습니다.' }, { status: 400 });

    //동일이메일 존재여부 확인하기위해 가져온 데이터
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id')
      .eq('email', newEmail)
      .maybeSingle();

    if (existingUser) return NextResponse.json({ message: '이미 사용중인 이메일입니다.' }, { status: 409 });

    if (existingUserError)
      return NextResponse.json({ message: `이메일 중복체크 실패 => ${existingUserError.message}` }, { status: 500 });

    const rawToken = randomUUID(); // UUID 랜덤 생성하고
    const tokenHash = hashToken(rawToken); //랜덤으로 생성한 UUID를 암호화
    const origin = request.nextUrl.origin; //origin URL 확보
    const params = new URLSearchParams({
      token: rawToken,
      userId: user.id,
    });
    const confirmUrl = `${origin}/api/auth/email-callback?${params.toString()}`;
    //이메일 대기상태 컬럼을 업데이트
    const { error: publicError } = await supabase
      .from('users')
      .update({
        pending_email: newEmail,
        pending_email_expires_at: new Date(Date.now() + EMAIL_CHANGE_EXPIRES_MS).toISOString(),
        email_change_token_hash: tokenHash,
      })
      .eq('id', user.id);

    if (publicError) return NextResponse.json({ message: publicError.message }, { status: 500 });

    try {
      //이메일 발송
      //email=새로 변경할 이메일
      //confirmUrl은 메일내부 링크를 의미함
      await sendEmailChangeMail({
        email: newEmail,
        confirmUrl,
      });
    } catch (error) {
      //오류나면 update한 데이터를 reset
      const { error: clearPendingError } = await clearPendingEmail(supabase, user.id);

      if (clearPendingError) return NextResponse.json({ message: clearPendingError.message }, { status: 500 });

      return NextResponse.json(
        { message: error instanceof Error ? error.message : '인증 메일 발송에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '이메일 변경 인증 메일이 발송되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('PATCH /api/user/email error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '이메일 업데이트 중 예상치 못한 오류 발생' },
      { status: 500 }
    );
  }
};

export const DELETE = async () => {
  //1. 현재로그인세션을 확인
  //2. public.users테입르의 pending정보를 reset
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user)
    return NextResponse.json({ message: '세션이 만료되었습니다. 다시 로그인 해주세요.' }, { status: 401 });

  const { error: clearPendingError } = await clearPendingEmail(supabase, user.id);

  if (clearPendingError) return NextResponse.json({ message: clearPendingError.message }, { status: 500 });

  return NextResponse.json({ message: '이메일 변경 요청이 취소되었습니다.' }, { status: 200 });
};
