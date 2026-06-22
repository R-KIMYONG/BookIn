import { DEFAULT_TARGET, TARGET_LIST, TargetTypes } from '@/shared/constants/category';
import { DEFAULT_QT, QUERY_TYPE_LIST } from '@/shared/domain/aladin/constants';
import { NextRequest, NextResponse } from 'next/server';
import { QueryType } from '@/shared/domain/aladin/types';
import { getLastPageServer } from '@/shared/lib/aladin/getLastPageServer';

export const maxDuration = 60;

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const rawTarget = (searchParams.get('target') ?? DEFAULT_TARGET).trim();
  const target = TARGET_LIST.includes(rawTarget as TargetTypes) ? (rawTarget as TargetTypes) : DEFAULT_TARGET;

  const rawQt = (searchParams.get('QueryType') ?? DEFAULT_QT).trim();
  const queryType = QUERY_TYPE_LIST.includes(rawQt as QueryType) ? (rawQt as QueryType) : DEFAULT_QT;

  const categoryId = Number(searchParams.get('CategoryId')) || 0;

  const result = await getLastPageServer({ queryType, target, categoryId });
  return NextResponse.json({ lastPage: result }, { status: 200 });
};
