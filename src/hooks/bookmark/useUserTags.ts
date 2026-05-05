import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { Tag } from '@/components/bookmark/BookmarkTagPicker';

export const useUserTags = (userId?: string) => {
  const supabase = createClient();

  return useQuery({
    queryKey: ['userTags', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error('userId required');
      const { data, error } = await supabase
        .from('bookmark_tag_links')
        .select('bookmark_tags(id,name,slug,color),bookmarks!inner(user_id)')
        .eq('bookmarks.user_id', userId);
      if (error) throw error;
      const map = new Map<string, Tag>();

      data?.forEach((row) => {
        const tag = row.bookmark_tags;
        if (!tag) return;
        map.set(tag.id, tag);
      });

      return Array.from(map.values());
    },
    staleTime: 1000 * 60 * 5,
  });
};
