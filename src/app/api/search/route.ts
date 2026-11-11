import { NextRequest, NextResponse } from 'next/server';
import { APP_QUERY_KEYS } from '@/shared/constants/urlParams';
import { getYes24Search } from '@/shared/lib/yes24/getYes24Search';
import { Yes24Error } from '@/shared/lib/yes24/client';
import { toPage, toSearchCategory, toSearchSort } from '@/shared/lib/yes24/searchParams';

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get(APP_QUERY_KEYS.searchKeyWord)?.trim() ?? '';
  if (!query) {
    return NextResponse.json({ items: [], totalCount: 0, page: 1, pageSize: 20 });
  }

  try {
    const result = await getYes24Search({
      query,
      category: toSearchCategory(searchParams.get(APP_QUERY_KEYS.target)),
      sort: toSearchSort(searchParams.get(APP_QUERY_KEYS.sort)),
      page: toPage(searchParams.get(APP_QUERY_KEYS.page)),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('검색 실패:', error);
    const status = error instanceof Yes24Error ? error.status : 500;
    return NextResponse.json({ message: '검색 중 오류가 발생했어요.' }, { status });
  }
};
