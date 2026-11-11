import { parseItemId } from '@/shared/domain/book/ids';
import { MyStatus } from '@/shared/domain/book/types';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const hasMemo = (memo: string | null) =>
  typeof memo === 'string' &&
  memo
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, '')
    .trim().length > 0;

// ?ids=1,2,3 → [{ itemId, liked, bookmarked, memoExists }] (로그인 사용자 기준)
export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const itemIds = (new URL(request.url).searchParams.get('ids')?.split(',') ?? [])
    .map(parseItemId)
    .filter((id) => id !== null);
  if (itemIds.length === 0) return NextResponse.json([]);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const empty: MyStatus[] = itemIds.map((itemId) => ({ itemId, liked: false, bookmarked: false, memoExists: false }));
    return NextResponse.json(empty, { status: 401 });
  }

  const [likes, bookmarks] = await Promise.all([
    supabase.from('likes').select('item_id').eq('user_id', user.id).in('item_id', itemIds),
    supabase.from('bookmarks').select('item_id, memo').eq('user_id', user.id).in('item_id', itemIds),
  ]);

  const likedSet = new Set(likes.data?.map((r) => r.item_id));
  const memoMap = new Map(bookmarks.data?.map((r) => [r.item_id, r.memo]));

  const result: MyStatus[] = itemIds.map((itemId) => ({
    itemId,
    liked: likedSet.has(itemId),
    bookmarked: memoMap.has(itemId),
    memoExists: hasMemo(memoMap.get(itemId) ?? null),
  }));
  return NextResponse.json(result, { status: 200 });
};
