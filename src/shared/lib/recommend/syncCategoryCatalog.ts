import 'server-only';
import { createAdminClient } from '../supabase/admin';
import { getYes24CategoryList } from '../yes24/getYes24CategoryList';
import { embedText } from '../embedding/embedText';

type CatalogRow = {
  category_id: string;
  category_name: string;
  full_path: string;
};

const BATCH_SIZE = 200;

const READ_PAGE_SIZE = 1000;

const cleanPath = (fullPath: string): string =>
  fullPath
    .split('>')
    .map((name) => name.trim())
    .join('>');

export const syncCategoryCatalog = async () => {
  const supabase = createAdminClient();

  const latest: CatalogRow[] = (await getYes24CategoryList()).map((category) => ({
    category_id: category.categoryId,
    category_name: category.categoryName.trim(),
    full_path: cleanPath(category.categoryFullPath),
  }));

  const existingRows: { category_id: string; full_path: string }[] = [];
  for (let from = 0; ; from += READ_PAGE_SIZE) {
    const { data, error: readError } = await supabase
      .from('book_category_catalog')
      .select('category_id, full_path')
      .order('category_id') // 페이지 사이에 행이 빠지거나 겹치지 않게 순서 고정
      .range(from, from + READ_PAGE_SIZE - 1);

    if (readError) throw readError;
    existingRows.push(...data);
    if (data.length < READ_PAGE_SIZE) break; // 마지막 페이지
  }

  const existingPathById = new Map(existingRows.map((row) => [row.category_id, row.full_path]));

  const toEmbed = latest.filter((row) => existingPathById.get(row.category_id) !== row.full_path);

  const latestIds = new Set(latest.map((row) => row.category_id));
  const toDelete = [...existingPathById.keys()].filter((id) => !latestIds.has(id));

  for (let start = 0; start < toEmbed.length; start += BATCH_SIZE) {
    const batch = toEmbed.slice(start, start + BATCH_SIZE);

    const vectors = await embedText(batch.map((row) => row.full_path));

    const { error: upsertError } = await supabase.from('book_category_catalog').upsert(
      batch.map((row, i) => ({
        ...row,
        embedding: JSON.stringify(vectors[i]), // pgvector 컬럼에는 '[0.01, -0.03, …]' 문자열로
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'category_id' }
    );

    if (upsertError) throw upsertError;
  }
  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase.from('book_category_catalog').delete().in('category_id', toDelete);
    if (deleteError) throw deleteError;
  }

  return {
    total: latest.length,
    embedded: toEmbed.length,
    deleted: toDelete.length,
  };
};
