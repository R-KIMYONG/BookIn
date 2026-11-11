import 'server-only';
import { CategoryNode } from '@/shared/domain/category/types';
import { getYes24CategoryList } from './getYes24CategoryList';
import { buildCategoryTree } from '@/shared/domain/category/tree';

export const getYes24CategoryTree = async (): Promise<CategoryNode[]> => {
  const list = await getYes24CategoryList();
  return buildCategoryTree(list);
};
