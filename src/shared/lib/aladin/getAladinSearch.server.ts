import 'server-only';
import { normalizeBook } from '../book/normalizeBook';
import { SearchQueryType } from '@/shared/domain/search/types';
import { TargetTypes } from '@/shared/constants/category';
import { Book } from '@/shared/types/api';
import { SEARCH_MAX_RESULTS } from '@/shared/domain/search/constants';
type GetAladinSearchProps = {
  keyword: string;
  searchQueryType: SearchQueryType;
  target: TargetTypes;
  categoryId: number;
  page: number;
};
export const getAladinSearch = async ({ keyword, searchQueryType, target, categoryId, page }: GetAladinSearchProps) => {
  const ttbKey = process.env.ALADIN_TTB_KEY;

  if (!ttbKey) throw new Error('ALADIN_TTB_KEY is missing');

  const params = new URLSearchParams({
    ttbkey: ttbKey,
    Query: keyword,
    QueryType: searchQueryType,
    SearchTarget: target,
    CategoryId: String(categoryId),
    Start: String(page),
    MaxResults: String(SEARCH_MAX_RESULTS),
    Sort: 'Accuracy',
    Cover: 'Big',
    Output: 'js',
    Version: '20131101',
  });

  const apiUrl = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?${params.toString()}`;

  const res = await fetch(apiUrl, { cache: 'no-store' });

  if (!res.ok) throw new Error(`Aladin search API Error ${res.status}`);

  const searchResult: Pick<Book, 'item' | 'totalResults' | 'itemsPerPage'> = await res.json();

  return {
    items: (searchResult.item ?? []).map(normalizeBook),
    totalResults: Number(searchResult.totalResults ?? 0),
    itemsPerPage: Number(searchResult.itemsPerPage ?? SEARCH_MAX_RESULTS),
  };
};
