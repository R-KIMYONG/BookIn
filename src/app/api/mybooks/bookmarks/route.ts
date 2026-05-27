import { NextRequest, NextResponse } from 'next/server';
import { MyBooksFilter } from '@/shared/domain/mybooks/filter';
import { SearchField } from '@/shared/domain/mybooks/search';
import { MyBooksSort, SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { getBookmarkBooks } from '@/shared/lib/server/mybooks/getBookmarkBooks';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');

  const sort = (searchParams.get('sort') as MyBooksSort) ?? SORT_DEFAULT;

  const search = searchParams.get('search');
  const searchField = searchParams.get('searchField') as SearchField | null;

  const memoFilter = searchParams.get('memoFilter') as MyBooksFilter;

  const tagId = searchParams.get('tagId');

  try {
    const result = await getBookmarkBooks({
      page,
      pageSize,
      sort,
      memoFilter,
      search,
      searchField,
      tagId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '조회 실패' }, { status: 500 });
  }
};
