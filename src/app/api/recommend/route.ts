import { getCandidatePool } from '@/shared/lib/recommendation/getCandidatePool';
import { getUserTasteProfile } from '@/shared/lib/recommendation/getUserTasteProfile';
import { createClient } from '@/shared/lib/supabase/server';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import * as z from 'zod/v4';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { AI_MODEL, recommendSystemPrompt } from '@/shared/domain/recommend/constants';
import dayjs from '@/shared/lib/date/dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { HOUR } from '@/shared/constants/time';

dayjs.extend(utc);
dayjs.extend(timezone);

const RecSchema = z.object({
  taste_summary: z.string(),
  groups: z.array(
    z.object({
      label: z.string(),
      isbns: z.array(z.string()),
    })
  ),
});

export const GET = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });

  const { data, error } = await supabase
    .from('user_recommendations')
    .select('recommendations, taste_summary, created_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: '불러오기 실패' }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
};

export const POST = async () => {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });

  const { data: existing } = await supabase
    .from('user_recommendations')
    .select('created_at, regen_count, regen_date')
    .eq('user_id', user.id)
    .maybeSingle();

  const today = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD');
  let newCount = 1;

  if (existing) {
    const elapsed = Date.now() - new Date(existing.created_at).getTime();

    if (elapsed < 1 * HOUR) {
      const leftMin = Math.ceil((1 * HOUR - elapsed) / 60000);

      return NextResponse.json({ error: `${leftMin}분 후에 다시 추천받을 수 있어요` }, { status: 429 });
    }

    if (existing.regen_date === today) {
      if (existing.regen_count >= 3) {
        return NextResponse.json(
          { error: '오늘 추천 새로고침 한도(3회)에 도달했어요. 내일 다시 가능해요.' },
          { status: 429 }
        );
      }
      newCount = existing.regen_count + 1; // 같은 날 → 누적
    }
    // regen_date가 어제면 newCount=1로 리셋(위 초기값)
  }

  const { data: profile } = await supabase.from('users').select('nickname').eq('id', user.id).single();

  const nickname = profile?.nickname ?? '회원';

  const taste = await getUserTasteProfile({ userId: user.id });

  if (taste.length === 0) return NextResponse.json({ coldStart: true, recommendations: [] });

  const excludeIsbns = new Set(taste.map((b) => b.isbn13));
  const pool = await getCandidatePool({ excludeIsbns });

  const signal = (b: (typeof taste)[number]) =>
    [b.liked && '좋아요', b.bookmarked && '북마크', b.commented && '댓글', b.viewed && '조회']
      .filter(Boolean)
      .join('·');

  const tasteText = taste.map((b) => `- ${b.title} / ${b.author} (${signal(b)})`).join('\n');

  const poolText = pool.map((c) => `- isbn13:${c.isbn13} | ${c.title} / ${c.author} | ${c.categoryName}`).join('\n');
  const client = new Anthropic();

  const response = await client.messages.parse({
    max_tokens: 2500,
    messages: [
      {
        role: 'user',
        content: `[사용자가 반응한 책]\n${tasteText}\n\n[후보 목록]\n${poolText}`,
      },
    ],
    model: AI_MODEL,
    system: recommendSystemPrompt(nickname),
    output_config: { format: zodOutputFormat(RecSchema) },
  });

  const result = response.parsed_output as z.infer<typeof RecSchema> | null;
  if (!result) return NextResponse.json({ error: '추천 생성에 실패했습니다' }, { status: 500 });

  const poolByIsbn = new Map(pool.map((c) => [c.isbn13, c]));

  const seen = new Set<string>(); //기록용 seen

  const validGroups = result.groups.map((g) => {
    const books: (typeof pool)[number][] = [];
    for (const isbn of g.isbns) {
      //AI의 추천 리스트는  -> pool있어야함 && seen 기록에 없어야함 -> 다음순환할때도 똑같이 pool에 있어야함 && seen 기록에 없어야함
      if (poolByIsbn.has(isbn) && !seen.has(isbn)) {
        // 풀에 있고 + 아직 안 나옴
        seen.add(isbn); // 즉시 기록 → 다음 중복은 바로 걸러짐
        books.push(poolByIsbn.get(isbn)!);
      }
    }
    return { label: g.label, books };
  });

  await supabaseAdmin.from('user_recommendations').upsert(
    {
      user_id: user.id,
      recommendations: validGroups,
      taste_summary: result.taste_summary,
      input_snapshot: {
        taste: taste.map((b) => ({
          isbn13: b.isbn13,
          signals: [b.liked && 'like', b.bookmarked && 'bookmark', b.commented && 'comment', b.viewed && 'view'].filter(
            Boolean
          ),
          score: b.score,
        })),
        poolSize: pool.length,
        model: AI_MODEL,
        usage: response.usage,
        generatedAt: dayjs().tz('Asia/Seoul').toISOString(),
      },
      regen_count: newCount,
      regen_date: today,
      created_at: new Date().toISOString(), // 명시 갱신
    },
    { onConflict: 'user_id' }
  );

  return NextResponse.json(
    {
      taste_summary: result.taste_summary,
      recommendations: validGroups,
      created_at: new Date().toISOString(),
    },
    { status: 200 }
  );
};
