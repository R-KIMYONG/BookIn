import { hashToken } from '@/shared/lib/crypto/hashToken';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  // 비로그인 경로 + password_reset_* 는 비공개 컬럼이라 관리자 클라이언트 사용
  const supabase = createAdminClient();

  const token = request.nextUrl.searchParams.get('token');

  if (!token) return NextResponse.json({ valide: false }, { status: 400 });

  const tokenHash = hashToken(token);

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('password_reset_token_hash', tokenHash)
    .gt('password_reset_expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ valide: false }, { status: 500 });
  }

  return NextResponse.json({ valide: !!data });
};
