import { RailResult } from '@/shared/domain/rails/types';
import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';
import { sliceAll } from '@/shared/lib/rails/sliceAll';
import { rebuildUserRails } from '@/shared/lib/recommend/rebuildUserRails';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { NextResponse } from 'next/server';
export const maxDuration = 60;

export const GET = async () => {
  const supabaseAdmin = createAdminClient();
  const user = await getCurrentUser();

  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('user_recommendations_v2')
    .select('recommendations,anchor_cursor,rails_created_at,reacted_count')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: '책추천 실패' }, { status: 500 });
  if (!data?.recommendations) return NextResponse.json(null, { status: 200 });

  const { data: lastReacted } = await supabaseAdmin.rpc('get_last_reacted_at', { p_user_id: user.id });
  const { data: currentCount } = await supabaseAdmin.rpc('get_reacted_count', { p_user_id: user.id });

  const stale =
    currentCount !== data.reacted_count ||
    (lastReacted && data.rails_created_at && new Date(lastReacted) > new Date(data.rails_created_at));

  if (stale) return NextResponse.json(null);

  return NextResponse.json(sliceAll(data?.recommendations as RailResult, data?.anchor_cursor ?? 0), { status: 200 });
};

export const POST = async () => {
  const user = await getCurrentUser();

  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  try {
    const result = await rebuildUserRails(user.id);
    return NextResponse.json(sliceAll(result, 0), { status: 200 });
  } catch (error) {
    console.error('rails 생성 실패:', error);
    return NextResponse.json({ error: '책추천 생성 실패' }, { status: 502 });
  }
};

export const PATCH = async () => {
  const supabaseAdmin = createAdminClient();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('user_recommendations_v2')
    .select('recommendations, anchor_cursor')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: '조회 실패' }, { status: 500 });
  if (!data?.recommendations) return NextResponse.json({ error: '먼저 추천을 생성해주세요' }, { status: 409 });

  const cursor = (data.anchor_cursor ?? 0) + 1;

  const { error: updErr } = await supabaseAdmin
    .from('user_recommendations_v2')
    .update({ anchor_cursor: cursor })
    .eq('user_id', user.id);
  if (updErr) console.error('cursor 갱신 실패:', updErr);

  return NextResponse.json(sliceAll(data.recommendations as RailResult, cursor), { status: 200 });
};
