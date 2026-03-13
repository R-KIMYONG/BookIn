import { QT_LIST, QueryType } from '@/types/useListUrlState.type';
import { NextRequest, NextResponse } from 'next/server';

type SearchTarget = 'Book' | 'Foreign' | 'eBook';
const ALLOWED_TARGETS: SearchTarget[] = ['Book', 'Foreign', 'eBook'] as const;
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rowQueryType = (searchParams.get('QueryType') ?? 'Bestseller').trim();
  const queryType = QT_LIST.includes(rowQueryType as QueryType) ? (rowQueryType as QueryType) : 'Bestseller';

  const rawTarget = (searchParams.get('target') ?? 'Book').trim() as SearchTarget;
  const target: SearchTarget = ALLOWED_TARGETS.includes(rawTarget) ? rawTarget : 'Book';

  const rawPage = Number(searchParams.get('page'));
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const categoryId = (searchParams.get('CategoryId') ?? '').trim();

  const params = new URLSearchParams({
    ttbkey: process.env.ALADIN_TTB_KEY ?? '',
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
      return new NextResponse('Aladin API Error', { status: 502 });
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
