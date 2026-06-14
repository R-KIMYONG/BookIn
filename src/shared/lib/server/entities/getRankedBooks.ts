import 'server-only';
import { createClient } from '../../supabase/server';
import { RankedBook } from '@/shared/domain/ranking/types';
import dayjs from '@/shared/lib/date/dayjs';
import { rankingCalcChange } from '@/shared/domain/ranking/rankingCalcChange';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getRankedBooks = async (): Promise<RankedBook[]> => {
  const supabase = await createClient();

  const { data: today, error } = await supabase
    .from('book_ranking')
    .select('*')
    .order('score', { ascending: false })
    .limit(50);

  if (error) throw error;
  const yesterday = dayjs().tz('Asia/Seoul').subtract(1, 'day').format('YYYY-MM-DD');

  const { data: snapshot, error: snapshotError } = await supabase
    .from('ranking_snapshots')
    .select('isbn13,rank')
    .eq('snapshot_date', yesterday);

  if (snapshotError) console.error('snapshot fetch 실패', snapshotError);

  const yMap = new Map((snapshot ?? []).map((s) => [s.isbn13, s.rank]));

  const rankingList = (today ?? []).map((book, i) => {
    const todayRank = i + 1;
    const yesterdayRank = yMap.get(book.isbn13);
    return {
      ...book,
      rank: todayRank,
      change: rankingCalcChange({ todayRank, yesterdayRank }),
    };
  });

  return rankingList;
};
