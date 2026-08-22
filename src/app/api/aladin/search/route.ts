import { TargetTypes } from '@/shared/constants/category';
import { SearchQueryType } from '@/shared/domain/search/types';
import { APP_QUERY_KEYS } from '@/shared/domain/aladin/constants';
import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_SEARCH_QT, SEARCH_QT_LIST } from '@/shared/domain/search/constants';
import { getAladinSearch } from '@/shared/lib/aladin/getAladinSearch.server';

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get(APP_QUERY_KEYS.searchKeyWord)?.trim() ?? '';
    const rawPage = Number(searchParams.get(APP_QUERY_KEYS.page) ?? '1');
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;
    const target = searchParams.get(APP_QUERY_KEYS.target)?.trim() as TargetTypes;

    const categoryId = Number(searchParams.get(APP_QUERY_KEYS.categoryId)?.trim()) || 0;

    const rawSearchQueryType = (
      searchParams.get(APP_QUERY_KEYS.searchQueryType) ?? DEFAULT_SEARCH_QT
    ).trim() as SearchQueryType;
    const searchQueryType = SEARCH_QT_LIST.includes(rawSearchQueryType) ? rawSearchQueryType : DEFAULT_SEARCH_QT;

    if (!keyword) return NextResponse.json({ items: [], totalResults: 0, itemsPerPage: 50 }, { status: 200 });

    const searchListData = await getAladinSearch({ keyword, target, categoryId, page, searchQueryType });

    return NextResponse.json(searchListData, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: '알라딘 검색 중 오류가 발생했습니다.' }, { status: 500 });
  }
};
