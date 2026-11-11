import 'server-only';
import { createClient } from '@/shared/lib/supabase/server';
import { Tag } from '@/shared/domain/tag/types';

export const getBookmarkTagsByIsbn = async (isbn13: string): Promise<Tag[]> => {
  if (!isbn13) return [];

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: bookmarkData, error: bookmarkErr } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('isbn13', isbn13)
    .maybeSingle();

  if (bookmarkErr || !bookmarkData) return [];

  const { data: links, error: linksErr } = await supabase
    .from('bookmark_tag_links')
    .select('tag:bookmark_tags(id,name,slug,color)')
    .eq('bookmark_id', bookmarkData.id);

  if (linksErr) return [];

  return (links ?? []).map((x) => (Array.isArray(x.tag) ? x.tag[0] : x.tag)).filter(Boolean) as Tag[];
};
