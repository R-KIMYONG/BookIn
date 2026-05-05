import { MAX_LENGTH_NICKNME } from '@/constants/user';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (request: NextRequest) => {
  const supabase = await createClient();
  try {
    const body = await request.json();
    const nickname = String(body?.nickname ?? '').trim();

    if (!nickname) {
      return NextResponse.json({ message: '닉네임을 입력해주세요.' }, { status: 400 });
    }

    if (nickname.length > MAX_LENGTH_NICKNME) {
      return NextResponse.json({ message: `닉네임은 ${MAX_LENGTH_NICKNME}자 이하만 가능합니다.` }, { status: 400 });
    }
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user)
      return NextResponse.json({ message: '사용자 정보를 가져오는 중 오류 발생' }, { status: 401 });

    const { error: publicError } = await supabase.from('users').update({ nickname }).eq('id', user.id).single();

    if (publicError) return NextResponse.json({ message: publicError.message }, { status: 500 });

    const { error: authError } = await supabase.auth.updateUser({ data: { nickname } });

    if (authError) return NextResponse.json({ message: authError.message }, { status: 500 });

    return NextResponse.json({ message: '닉네임 변경 완료' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '닉네임 변경 중 오류가 발생했습니다.' }, { status: 500 });
  }
};
