import { parseItemId } from '@/shared/domain/book/ids';
import { BookmarkCache } from '@/shared/domain/bookmark/types';
import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';
import { ensureBook } from '@/shared/lib/book/ensureBook';
import { scheduleRailsRebuild } from '@/shared/lib/recommend/scheduleRailsRebuild';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

const hasMemo = (memo: string | null) => {
  if (typeof memo !== 'string') return false;

  const text = memo
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, '')
    .trim();

  return text.length > 0;
};

// ?bookIds=1,2,3 → [{ itemId, bookmarked, memoExists }]
export const GET = async (request: NextRequest) => {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);

  const itemIds = (searchParams.get('bookIds')?.split(',') ?? []).map(parseItemId).filter((id) => id !== null);

  if (itemIds.length === 0) return NextResponse.json([], { status: 200 });
  const user = await getCurrentUser();

  if (!user) {
    const result: BookmarkCache[] = itemIds.map((itemId) => ({ itemId, bookmarked: false, memoExists: false }));

    return NextResponse.json(result, { status: 200 });
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('item_id,memo')
    .eq('user_id', user.id)
    .in('item_id', itemIds);

  if (error) {
    console.error('bookmark GET error:', error);
    return NextResponse.json({ error: '북마크 목록 조회에 실패했습니다.' }, { status: 500 });
  }

  const bookmarkedMap = new Map<number, { memo: string | null }>();
  (data ?? []).forEach((row) => bookmarkedMap.set(row.item_id, { memo: row.memo ?? null }));

  const result: BookmarkCache[] = itemIds.map((itemId) => {
    const row = bookmarkedMap.get(itemId);
    return {
      itemId,
      bookmarked: !!row,
      memoExists: row ? hasMemo(row.memo) : false,
    };
  });
  return NextResponse.json(result, { status: 200 });
};

// body: { itemId } → 북마크 추가. 책 정보는 서버가 YES24로 확인
export const POST = async (request: NextRequest) => {
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const itemId = parseItemId(body?.itemId);
  if (!itemId) return NextResponse.json({ error: '올바른 itemId가 필요합니다.' }, { status: 400 });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

  const bookId = await ensureBook(itemId);
  if (!bookId) return NextResponse.json({ error: '책 정보를 찾을 수 없습니다.' }, { status: 404 });

  const { error: bookmarkError } = await supabase.from('bookmarks').insert({
    user_id: user.id,
    book_id: bookId,
    item_id: itemId,
  });

  // 23505 = 이미 북마크됨 (unique 위반) → 성공으로 처리
  if (bookmarkError && bookmarkError.code !== '23505') {
    console.error('bookmark insert error:', bookmarkError);
    return NextResponse.json({ error: '북마크 추가에 실패했습니다.' }, { status: 500 });
  }
  scheduleRailsRebuild(user.id);
  return NextResponse.json({ itemId, bookmarked: true, memoExists: false } satisfies BookmarkCache, { status: 200 });
};

// body: { itemId } → 북마크 해제
export const DELETE = async (request: NextRequest) => {
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const itemId = parseItemId(body?.itemId);
  if (!itemId) return NextResponse.json({ error: '올바른 itemId가 필요합니다.' }, { status: 400 });

  const user = await getCurrentUser();

  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

  const { error } = await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('item_id', itemId);

  if (error) {
    console.error('bookmark delete error:', error);
    return NextResponse.json({ error: '북마크 해제에 실패했습니다.' }, { status: 500 });
  }
  scheduleRailsRebuild(user.id);
  return NextResponse.json({ itemId, bookmarked: false, memoExists: false } satisfies BookmarkCache, { status: 200 });
};
