type CategoryEntry = { categoryId: string; categoryFullPath: string };

const toSortPathKey = (categoryFullPath: string): string =>
  categoryFullPath
    .split('>')
    .map((name) => name.trim())
    .join('-');

export const resolveCategoryId = (sortPath: string | null, categories: CategoryEntry[]): string | null => {
  if (!sortPath) return null;

  const idByPath = new Map(categories.map((c) => [toSortPathKey(c.categoryFullPath), c.categoryId]));

  // sortPath는 '-'로 쪼개지 않음 (이름 안에 '-'가 있음). 통째로 찾고, 실패하면 마지막 '-' 뒤를 잘라냄
  let path = sortPath.trim();
  while (path.includes('-')) {
    const categoryId = idByPath.get(path);
    if (categoryId) return categoryId;

    path = path.slice(0, path.lastIndexOf('-')).trim();
  }

  return null;
};
