import 'server-only';
import { createClient } from '../../supabase/server';
import { RankedBook } from '@/shared/domain/ranking/types';
import dayjs from '@/shared/lib/date/dayjs';
import { rankingCalcChange } from '@/shared/domain/ranking/rankingCalcChange';
import { toRankingBook } from '@/shared/domain/ranking/toRankingBook';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getRankedBooks = async (): Promise<RankedBook[]> => {
  const supabase = await createClient();

  const { data: today, error } = await supabase
    .from('book_ranking')
    .select('*')
    .gt('score', 0)
    .order('score', { ascending: false })
    .limit(50);

  if (error) throw error;
  const yesterday = dayjs().tz('Asia/Seoul').subtract(1, 'day').format('YYYY-MM-DD');

  const { data: snapshot, error: snapshotError } = await supabase
    .from('ranking_snapshots')
    .select('item_id,rank')
    .eq('snapshot_date', yesterday);

  if (snapshotError) console.error('snapshot fetch 실패', snapshotError);

  const yMap = new Map((snapshot ?? []).map((s) => [s.item_id, s.rank]));

  const books = (today ?? []).map(toRankingBook).filter((book) => book !== null);

  const rankingList = books.map((book, i) => {
    const todayRank = i + 1;
    const yesterdayRank = yMap.get(book.item_id);
    return {
      ...book,
      rank: todayRank,
      change: rankingCalcChange({ todayRank, yesterdayRank }),
    };
  });

  return rankingList;
};
