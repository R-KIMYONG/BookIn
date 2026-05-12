import { QUERY_TYPE_LIST, QueryType } from '@/shared/domain/aladin/constants';
import { NextRequest, NextResponse } from 'next/server';

type SearchTarget = 'Book' | 'Foreign' | 'eBook';
const ALLOWED_TARGETS: SearchTarget[] = ['Book', 'Foreign', 'eBook'] as const;
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rawQueryType = (searchParams.get('QueryType') ?? 'Bestseller').trim();
  const queryType = QUERY_TYPE_LIST.includes(rawQueryType as QueryType) ? (rawQueryType as QueryType) : 'Bestseller';

  const rawTarget = (searchParams.get('target') ?? 'Book').trim() as SearchTarget;
  const target: SearchTarget = ALLOWED_TARGETS.includes(rawTarget) ? rawTarget : 'Book';

  const rawPage = Number(searchParams.get('page'));
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const categoryId = (searchParams.get('CategoryId') ?? '').trim();

  const ttbKey = process.env.ALADIN_TTB_KEY;
  if (!ttbKey) return NextResponse.json({ message: '알라딘 API 설정이 올바르지 않습니다.' }, { status: 500 });

  const params = new URLSearchParams({
    ttbkey: ttbKey,
    QueryType: queryType,
    SearchTarget: target,
    Start: String(page),
    MaxResults: '20',
    Cover: 'Big',
    Output: 'js',
    Version: '20131101',
  });

  if (categoryId) params.set('CategoryId', categoryId);

  const API_URL = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?${params.toString()}`;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      return NextResponse.json({ message: '알라딘 도서 목록을 불러오지 못했습니다.' }, { status: 502 });
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: '알라딘 도서 목록 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
