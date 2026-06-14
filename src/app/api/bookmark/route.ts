import { upsertBook } from '@/shared/lib/book/upsertBook';
import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);

  const bookIds = searchParams.get('bookIds')?.split(',').filter(Boolean) ?? []; //각 isbn13값

  if (bookIds.length === 0) return NextResponse.json([], { status: 200 });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const result = bookIds.map((isbn13) => ({ isbn13, bookmarked: false, memoExists: false }));

    return NextResponse.json(result, { status: 200 });
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('isbn13,memo')
    .eq('user_id', user.id)
    .in('isbn13', bookIds);

  if (error) {
    console.error('bookmark GET error:', error);
    return NextResponse.json({ error: '북마크 목록 조회에 실패했습니다.' }, { status: 500 });
  }

  const bookmarkedMap = new Map<string, { memo: string | null }>();
  (data ?? []).forEach((row) => bookmarkedMap.set(row.isbn13, { memo: row.memo ?? null }));

  const hasMemo = (memo: string | null) => {
    if (typeof memo !== 'string') return false;

    const text = memo
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, '')
      .trim();

    return text.length > 0;
  };

  const result = bookIds.map((isbn13: string) => {
    const row = bookmarkedMap.get(isbn13);
    return {
      isbn13,
      bookmarked: !!row,
      memoExists: row ? hasMemo(row.memo) : false,
    };
  });
  return NextResponse.json(result, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();

  const { isbn13, title, cover, author, categoryId, categoryName } = await request.json();

  if (!isbn13) return NextResponse.json({ error: 'isbn13 값이 필요합니다.' }, { status: 400 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

  const bookId = await upsertBook({ supabase, bookInfo: { isbn13, title, cover, author, categoryId, categoryName } });

  const { error: bookmarkError } = await supabase.from('bookmarks').insert({
    user_id: user.id,
    book_id: bookId,
    isbn13: isbn13,
  });

  if (bookmarkError && bookmarkError.code !== '23505') {
    console.error('book upsert errro:', bookmarkError);
    return NextResponse.json({ error: '북마크 추가에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json(
    {
      isbn13,
      bookmarked: true,
      memoExists: false,
    },
    { status: 200 }
  );
};

export const DELETE = async (request: NextRequest) => {
  const supabase = await createClient();
  const { isbn13 } = await request.json();

  if (!isbn13) return NextResponse.json({ error: 'isbn13 값이 필요합니다.' }, { status: 400 });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

  const { data: book, error: bookError } = await supabase.from('books').select('id').eq('isbn13', isbn13).maybeSingle();

  if (bookError) {
    console.error('book select error:', bookError);
    return NextResponse.json({ error: '책 정보를 조회하는 중 오류가 발생했습니다.' }, { status: 500 });
  }

  if (!book) return NextResponse.json({ success: true });

  const { error } = await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('isbn13', isbn13);

  if (error) {
    console.error('bookmark delete error:', error);
    return NextResponse.json({ error: '북마크 해제에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ isbn13, bookmarked: false, memoExists: false }, { status: 200 });
};
