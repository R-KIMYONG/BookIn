import 'server-only';
import { createClient } from '@/shared/lib/supabase/server';
import { TOP_VIEW_LIMIT } from '@/shared/domain/ranking/constants';
import { toRankingBook } from '@/shared/domain/ranking/toRankingBook';
import { TopViewType } from '@/shared/domain/ranking/types';

export const getTopViewBooks = async (): Promise<TopViewType[]> => {
  const supabase = await createClient();

  // 조회수 0인 책은 순위에 넣지 않음 (디테일을 열면 책이 먼저 저장되므로 0인 행이 존재)
  const { data, error } = await supabase
    .from('book_ranking')
    .select('*')
    .gt('view_count', 0)
    .order('view_count', { ascending: false })
    .limit(TOP_VIEW_LIMIT);

  if (error) throw error;
  return data.map(toRankingBook).filter((book) => book !== null);
};
