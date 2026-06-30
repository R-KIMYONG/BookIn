import { ALLOWED_TARGETS, DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';
import { DEFAULT_QT, QUERY_TYPE_LIST, APP_QUERY_KEYS } from '@/shared/domain/aladin/constants';
import { QueryType } from '@/shared/domain/aladin/types';
import { getAladinList } from '@/shared/lib/aladin/getAladinList.server';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const rawQueryType = (searchParams.get(APP_QUERY_KEYS.queryType) ?? DEFAULT_QT).trim();
    const queryType = QUERY_TYPE_LIST.includes(rawQueryType as QueryType) ? (rawQueryType as QueryType) : DEFAULT_QT;

    const rawTarget = (searchParams.get(APP_QUERY_KEYS.target) ?? DEFAULT_TARGET).trim() as TargetTypes;
    const target: TargetTypes = ALLOWED_TARGETS.includes(rawTarget) ? rawTarget : DEFAULT_TARGET;
    const rawPage = Number(searchParams.get(APP_QUERY_KEYS.page));
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

    const rawCategoryId = Number(searchParams.get(APP_QUERY_KEYS.categoryId));

    const categoryId = Number.isFinite(rawCategoryId) && rawCategoryId > 0 ? rawCategoryId : undefined;

    const data = await getAladinList({ queryType, page, target, categoryId });

    return NextResponse.json(data);
  } catch (error) {
    if (request.signal.aborted) return new NextResponse(null, { status: 499 });

    console.error(error);
    return NextResponse.json({ message: '알라딘 도서 목록 조회 실패' }, { status: 500 });
  }
};
