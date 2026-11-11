import { TopanchorType } from '@/shared/domain/rails/types';
import { createAdminClient } from '../supabase/admin';
import { parseItemId } from '@/shared/domain/book/ids';

export const getTopAnchors = async (userId: string): Promise<TopanchorType[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('get_top_anchor', { p_user_id: userId });
  if (error) console.error('anchor 선정 실패:', error);

  return (data ?? []).flatMap((row): TopanchorType[] => {
    const itemId = parseItemId(row.item_id);
    if (!itemId) return [];

    return [
      {
        itemId,
        title: row.title,
        category_id: row.category_id,
        category_name: row.category_name,
      },
    ];
  });
};
