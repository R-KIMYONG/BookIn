import { AI_MODEL, recommendSystemV2Prompt } from '@/shared/domain/recommend/constants';
import { RecommendBook } from '@/shared/domain/recommend/types';
import { getUserTasteProfile } from '@/shared/lib/recommendation/getUserTasteProfile';
import { getRecommendations } from '@/shared/lib/server/entities/getRecommendations';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { createClient } from '@/shared/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod.mjs';
import { NextResponse } from 'next/server';
import * as z from 'zod/v4';

const RecV2Schema = z.object({
  taste_summary: z.string(),
  label: z.string(),
});

export const GET = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  try {
    const data = await getRecommendations(user.id);
    return NextResponse.json(data ?? null, { status: 200 });
  } catch {
    return NextResponse.json({ error: '불러오기 실패' }, { status: 500 });
  }
};

export const POST = async () => {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인 필요합니다.' }, { status: 401 });

  const { data: profile } = await supabase.from('users').select('nickname').eq('id', user.id).single();

  const nickname = profile?.nickname ?? '회원';

  const existing = await getRecommendations(user.id);

  if (existing?.created_at) {
    const elapsed = Date.now() - new Date(existing.created_at).getTime();
    const COOLDOWN = 5 * 60 * 1000; // 10분
    if (elapsed < COOLDOWN) {
      const leftMin = Math.ceil((COOLDOWN - elapsed) / 60000);
      return NextResponse.json({ error: `${leftMin}분 후에 다시 추천받을 수 있어요` }, { status: 429 });
    }
  }

  const { data, error } = await supabaseAdmin.rpc('match_book_for_user', {
    p_user_id: user.id,
    match_count: 50, // ❇️❇️❇️❇️일단 10개로 해서 나중에 새로 추천받기 버튼 있으면 100개로 해서 렌덤으로 중복없이 유저에게 주기❇️❇️❇️❇️
  });

  if (error) {
    console.error('rpc 에러:', error);
    return NextResponse.json({ error: '추천실패' }, { status: 500 });
  }

  const taste = await getUserTasteProfile({ userId: user.id }); //현재 유저의 취향을 수집 -> 추후  rpc함수로 전향하면 로직이 단순해짐

  if (taste.length === 0) return NextResponse.json({ coldStart: true, recommendations: [] });

  const signal = (b: (typeof taste)[number]) =>
    [b.liked && '좋아요', b.bookmarked && '북마크', b.commented && '댓글', b.viewed && '조회']
      .filter(Boolean)
      .join('·');

  const shuffled = [...data];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const picked = shuffled.slice(0, 10).sort((a, b) => b.similarity - a.similarity);

  const tasteText = taste.map((b) => `- ${b.title} / ${b.author} (${signal(b)})`).join('\n'); //유저 취향의 책들을 제목+저자+좋아요(경로)로 묶어서 AI에 주기
  const recommendedText = picked.map((b: RecommendBook) => `- ${b.title} / ${b.author}`).join('\n'); //취향기준 결과목록의 제목+저자로 묶어서 AI에 주기

  const client = new Anthropic();

  const response = await client.messages.parse({
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `[반응한 책]\n${tasteText}\n\n[추천된 책]\n${recommendedText}`,
      },
    ],
    model: AI_MODEL,
    system: recommendSystemV2Prompt(nickname),
    output_config: { format: zodOutputFormat(RecV2Schema) },
  });

  const result = response.parsed_output as z.infer<typeof RecV2Schema> | null;

  await supabaseAdmin.from('user_recommendations_v2').upsert(
    {
      user_id: user.id,
      taste_summary: result?.taste_summary,
      label: result?.label,
      recommendations: picked,
      created_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  return NextResponse.json(
    {
      recommendations: picked ?? [],
      taste_summary: result?.taste_summary,
      label: result?.label,
    },
    { status: 200 }
  );
};
