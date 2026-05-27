import { NextRequest, NextResponse } from 'next/server';
import { MyBooksSort, SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { SearchField } from '@/shared/domain/mybooks/search';
import { getLikeBooks } from '@/shared/lib/server/mybooks/getLikeBooks';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');

  const sort = (searchParams.get('sort') as MyBooksSort) ?? SORT_DEFAULT;

  const search = searchParams.get('search');
  const searchField = searchParams.get('searchField') as SearchField | null;

  try {
    const result = await getLikeBooks({
      page,
      pageSize,
      sort,
      search,
      searchField,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '조회 실패' }, { status: 500 });
  }
};
