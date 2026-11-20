import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/constants/site';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { HOME_SECTIONS } from '@/shared/lib/yes24/constants';

export const revalidate = 86400; // 하루에 한 번 다시 생성

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const fixed: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/digging`, changeFrequency: 'weekly', priority: 0.7 },
    ...HOME_SECTIONS.map((s) => ({
      url: `${SITE_URL}/category/${s.categoryId}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];

  const { data } = await createAdminClient()
    .from('books')
    .select('item_id, page_modified_at')
    .eq('adult', false)
    .order('page_modified_at', { ascending: false })
    .limit(5000);

  const books: MetadataRoute.Sitemap = (data ?? []).map((b) => ({
    url: `${SITE_URL}/${b.item_id}`,
    lastModified: b.page_modified_at,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...fixed, ...books];
};

export default sitemap;
