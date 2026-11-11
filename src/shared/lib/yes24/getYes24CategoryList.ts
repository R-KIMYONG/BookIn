import 'server-only';
import { yes24Fetch } from './client';
import { Yes24Category, Yes24CategoryListData } from './types';

export const getYes24CategoryList = async (): Promise<Yes24Category[]> => {
  const { data } = await yes24Fetch<Yes24CategoryListData>('/category/list', {}, { revalidate: 86400 });
  return data;
};
