import { ALLOWED_TARGETS, DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';
import { DEFAULT_QT, QUERY_TYPE_LIST, QueryType } from '@/shared/domain/aladin/constants';
import { getAladinList } from '@/shared/lib/aladin/getAladinList.server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryType = (searchParams.get('QueryType') ?? DEFAULT_QT).trim();
    const queryType = QUERY_TYPE_LIST.includes(rawQueryType as QueryType) ? (rawQueryType as QueryType) : DEFAULT_QT;

    const rawTarget = (searchParams.get('target') ?? DEFAULT_TARGET).trim() as TargetTypes;
    const target: TargetTypes = ALLOWED_TARGETS.includes(rawTarget) ? rawTarget : DEFAULT_TARGET;
    const rawPage = Number(searchParams.get('page'));
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

    const rawCategoryId = Number(searchParams.get('CategoryId'));

    const categoryId = Number.isFinite(rawCategoryId) && rawCategoryId > 0 ? rawCategoryId : undefined;

    const data = await getAladinList({ queryType, page, target, categoryId });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '알라딘 도서 목록 조회 실패' }, { status: 500 });
  }
};
