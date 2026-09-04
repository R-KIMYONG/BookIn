import { RailResult } from '@/shared/domain/rails/types';
import { getTrending } from '@/shared/lib/rails/getchTrending';
import { getSimilar } from '@/shared/lib/rails/getSimilar';
import { getSniping } from '@/shared/lib/rails/getSniping';
import { getTopAnchors } from '@/shared/lib/rails/getTopAnchors';
import { sliceAll } from '@/shared/lib/rails/sliceAll';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { createClient } from '@/shared/lib/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  const anchors = await getTopAnchors(user.id);
  const n = anchors.length;

  let result: RailResult;
  if (n === 0) {
    // 기준이 없는거니까 queryType: bestseller,target: Book,categoryId: None  없는 요즘뜨는 책을 반환
    const trending = await getTrending(); // 폴백
    result = { trending: { categoryName: null, books: trending }, sniping: [], anchor: { title: null, books: [] } };
  } else {
    //제일 좋아하는 책이 하나 이상이니까
    const a = anchors[0]; // 대표(최상위) 앵커 — 이 책 기준으로 anchor/trending 레일 구성
    const [trending, sniping, similar] = await Promise.all([
      getTrending(a.category_id),
      getSniping(user.id),
      getSimilar(user.id, a.isbn13),
    ]); //책한권 취향책 리스트 & 종합책추천리스트
    if (n === 1) {
      //근데 제일 좋아하는 책이 좋아요,북마크,댓글 통틀어서 한권일때 종합책추천리스트와 책한권 취챵핵 리스트가 동일하니까 중복된결과를 fetch해서 하나를 제외시키기위함
      result = {
        // 책이 1권뿐이면 sniping(평균)≈anchor(그 1권)라 중복.
        // 그래서 sniping 결과를 anchor 자리에 쓰고, sniping 레일은 비운다.
        trending: { categoryName: a.category_name, books: trending },
        sniping: [],
        anchor: { title: a.title, books: sniping },
      };
    } else {
      const set = new Set(sniping.map((b) => b.isbn13));
      result = {
        trending: { categoryName: a.category_name, books: trending },
        sniping,
        anchor: { title: a.title, books: similar.filter((b) => !set.has(b.isbn13)) },
      };
    }
  }

  const { data: reactedCount } = await supabaseAdmin.rpc('get_reacted_count', { p_user_id: user.id });

  const { error: upsertErr } = await supabaseAdmin.from('user_recommendations_v2').upsert(
    {
      user_id: user.id,
      recommendations: result,
      anchor_cursor: 0,
      reacted_count: reactedCount ?? 0,
      rails_created_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (upsertErr) console.error('rails 저장 실패:', upsertErr);

  return NextResponse.json(sliceAll(result, 0), { status: 200 });
};

export const PATCH = async () => {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
