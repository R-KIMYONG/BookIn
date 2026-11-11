import { Yes24Category } from '@/shared/lib/yes24/types';
import { CategoryNode } from './types';

//제외해야할 항목
const EXCLUDED_IDS = ['003', '004', '017001033', '017001062'];

// 메뉴에 넣을 항목인지 판단
const isBookCategory = (category: Yes24Category): boolean => {
  return !EXCLUDED_IDS.some((id) => category.categoryId.startsWith(id));
};

// 한 줄 목록 → 대분류 배열 (안에 중분류, 그 안에 소분류)
export const buildCategoryTree = (categories: Yes24Category[]): CategoryNode[] => {
  // 1. 책이 아닌 항목 걸러내기
  // 2. 각 항목을 CategoryNode로 바꾸기 (children은 빈 배열로 시작)
  // 3. 각 노드를 부모의 children에 넣기
  // 4. 대분류만 골라서 반환

  const filterResult = categories.filter(isBookCategory);

  const nodes = filterResult.map(
    (category): CategoryNode => ({
      id: category.categoryId,
      name: category.categoryName.trim(),
      children: [],
    })
  );

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  for (const node of nodes) {
    if (node.id.length === 3) continue; // 대분류는 부모가 없음

    const parentId = node.id.length === 12 ? node.id.slice(0, 9) : node.id.slice(0, 3);
    nodeMap.get(parentId)?.children.push(node);
  }
  const categoryList = nodes.filter((node) => node.id.length === 3);

  return categoryList;
};

export const findCategoryPath = (categoryTree: CategoryNode[], categoryId: string): CategoryNode[] | null => {
  const mallId = categoryId.slice(0, 3);
  const midId = categoryId.slice(0, 9);

  const mall = categoryTree.find((node) => node.id === mallId);
  if (!mall) return null;
  if (categoryId.length === 3) return [mall];
  const mid = mall?.children.find((node) => node.id === midId);
  if (!mid) return null;
  if (categoryId.length === 9) return [mall, mid];
  const small = mid?.children.find((node) => node.id === categoryId);
  return small ? [mall, mid, small] : null;
};
