import { createAdminClient } from '@/shared/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();

  const todayKST = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());

  const { data: ranking, error: rankErr } = await admin
    .from('book_ranking')
    .select('book_id, item_id, score')
    .gt('score', 0)
    .order('score', { ascending: false })
    .limit(100);

  if (rankErr) return NextResponse.json({ error: rankErr.message }, { status: 500 });
  if (!ranking || ranking.length === 0) {
    return NextResponse.json({ ok: true, message: 'no ranking data' });
  }

  const rows = ranking.flatMap((book, i) =>
    book.book_id !== null && book.item_id !== null
      ? [
          {
            snapshot_date: todayKST,
            book_id: book.book_id,
            item_id: book.item_id,
            rank: i + 1,
            score: book.score ?? 0,
          },
        ]
      : []
  );

  const { error: upsertErr } = await admin
    .from('ranking_snapshots')
    .upsert(rows, { onConflict: 'snapshot_date,item_id' });

  if (upsertErr) return NextResponse.json({ error: upsertErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, date: todayKST, count: rows.length });
};
