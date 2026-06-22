import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const hasMemo = (memo: string | null) =>
  typeof memo === 'string' &&
  memo
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, '')
    .trim().length > 0;

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();
  const bookIds = new URL(request.url).searchParams.get('ids')?.split(',').filter(Boolean) ?? [];
  if (bookIds.length === 0) return NextResponse.json([]);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      bookIds.map((isbn13) => ({ isbn13, liked: false, bookmarked: false, memoExists: false })),
      { status: 401 }
    );

  const [likes, bookmarks] = await Promise.all([
    supabase.from('likes').select('isbn13').eq('user_id', user.id).in('isbn13', bookIds),
    supabase.from('bookmarks').select('isbn13, memo').eq('user_id', user.id).in('isbn13', bookIds),
  ]);

  const likedSet = new Set(likes.data?.map((r) => r.isbn13));
  const memoMap = new Map(bookmarks.data?.map((r) => [r.isbn13, r.memo]));

  const result = bookIds.map((isbn13) => ({
    isbn13,
    liked: likedSet.has(isbn13),
    bookmarked: memoMap.has(isbn13),
    memoExists: hasMemo(memoMap.get(isbn13) ?? null),
  }));
  return NextResponse.json(result, { status: 200 });
};
