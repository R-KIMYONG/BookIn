import { SEARCH_QT_LIST, SearchQueryType } from '@/shared/constants/search';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const keyword = searchParams.get('SearchKeyWord')?.trim() ?? '';

  const rawPage = Number(searchParams.get('page') ?? '1');
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const rawSearchQueryType = (searchParams.get('QueryType') ?? 'Keyword').trim() as SearchQueryType;
  const searchQueryType = SEARCH_QT_LIST.includes(rawSearchQueryType) ? rawSearchQueryType : 'Keyword';

  if (!keyword) return NextResponse.json({ items: [], total: 0 }, { status: 200 });

  const ttbKey = process.env.ALADIN_TTB_KEY;
  if (!ttbKey) return NextResponse.json({ message: '알라딘 API 설정이 올바르지 않습니다.' }, { status: 500 });

  const params = new URLSearchParams({
    ttbkey: ttbKey,
    Query: keyword,
    QueryType: searchQueryType,
    SearchTarget: 'All',
    Start: String(page),
    MaxResults: '20',
    Sort: 'Accuracy',
    Cover: 'Big',
    Output: 'js',
    Version: '20131101',
  });

  const apiUrl = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?${params.toString()}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) return NextResponse.json({ message: '알라딘 검색 결과를 불러오지 못했습니다.' }, { status: 502 });

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: '알라딘 검색 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
