import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { hashToken } from '@/app/lib/crypto/hashToken';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { clearPendingEmail } from '@/app/lib/supabase/users';

export const GET = async (request: Request) => {
  // 사용자가 인증메일 클릭해서 들어오면 아래 링크 작동됨
  // 링크에 있는 토큰과 userId를 찾아
  // 누구의 이메일변경요청인지 검증한다.
  // userId와 token으로 public.users테이블의 정보와 대조
  // 취소,만료,무효,오류 상황을 분기처리한다.
  // 모두 맞게되면 supabase auth.user테이블 정보를 업데이트 아니면 분기처리함
  const { searchParams, origin } = new URL(request.url);

  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  const next = searchParams.get('next') ?? '/email-confirmed';

  if (!token || !userId) {
    return NextResponse.redirect(`${origin}/auth-code-error?reason=error`);
  }

  const supabase = createClient();

  const { data: pendingData, error: pendingDataError } = await supabase
    .from('users')
    .select('id,pending_email,pending_email_expires_at,email_change_token_hash')
    .eq('id', userId)
    .single();

  if (pendingDataError || !pendingData) {
    return NextResponse.redirect(`${origin}/auth-code-error?reason=error`);
  }

  // 이미 취소된 경우
  if (!pendingData.pending_email || !pendingData.email_change_token_hash) {
    return NextResponse.redirect(`${origin}/auth-code-error?reason=cancelled`);
  }

  const now = Date.now();
  const expireAt = pendingData.pending_email_expires_at
    ? new Date(pendingData.pending_email_expires_at).getTime()
    : null;

  // 만료된 경우
  if (!expireAt || expireAt <= now) {
    const { error: clearPendingError } = await clearPendingEmail(supabase, userId);
    if (clearPendingError) {
      console.error('clearPendingEmail error:', clearPendingError);
    }

    return NextResponse.redirect(`${origin}/auth-code-error?reason=expired`);
  }

  const tokenHash = hashToken(token);

  // 토큰이 틀린 경우
  if (tokenHash !== pendingData.email_change_token_hash) {
    return NextResponse.redirect(`${origin}/auth-code-error?reason=invalid`);
  }

  const supabaseAdmin = createAdminClient();

  const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    email: pendingData.pending_email,
    email_confirm: true,
  });

  if (authUpdateError) {
    return NextResponse.redirect(`${origin}/auth-code-error?reason=error`);
  }

  const { error: publicUpdateError } = await supabase
    .from('users')
    .update({
      email: pendingData.pending_email, //변경할 이메일을 최종반영처리 나머지 정보를 reset
      pending_email: null,
      pending_email_expires_at: null,
      email_change_token_hash: null,
    })
    .eq('id', userId);

  if (publicUpdateError) {
    console.error('public user email sync failed:', publicUpdateError);
    return NextResponse.redirect(`${origin}/auth-code-error?reason=error`);
  }

  return NextResponse.redirect(`${origin}${next}`);
};
