import 'server-only';
import { createClient } from '../../supabase/server';

export const getUserTagsServer = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('bookmark_tag_links')
    .select('bookmark_tags(id,name,slug,color),bookmarks!inner(user_id)')
    .eq('bookmarks.user_id', user.id);

  if (error) throw new Error(error.message);
  const map = new Map();

  data?.forEach((row) => {
    const tag = Array.isArray(row.bookmark_tags) ? row.bookmark_tags[0] : row.bookmark_tags;

    if (!tag) return;

    map.set(tag.id, tag);
  });

  return Array.from(map.values());
};
