'use client';

import { useQuery } from '@tanstack/react-query';
import TagArea from '@/components/bookmark/TagArea';
import { MINUTE } from '@/shared/constants/time';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { Tag } from '@/shared/domain/tag/types';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';

type DetailBookmarkRes = { tags: Tag[] };
const DetailBookmarkTags = ({ isbn13, userId }: { isbn13: string; userId: string | null }) => {
  const enabled = !!userId && !!isbn13;
  const { open } = useBookmarkMemoUrlState();

  const { data, isPending, isError } = useQuery<DetailBookmarkRes>({
    queryKey: bookmarkKeys.tags.detail(userId, isbn13),
    queryFn: async () => {
      const res = await fetch(`/api/bookmark/tags?isbn13=${encodeURIComponent(isbn13)}`, { cache: 'no-store' });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? '태그를 불러오지 못했습니다.');

      const tags = Array.isArray(body?.tags) ? (body.tags as Tag[]) : [];
      return { tags };
    },
    enabled: enabled,
    staleTime: 3 * MINUTE,
  });
  if (!enabled) return null;

  if (isPending) return null;

  if (isError) return null;
  const tagNames = data?.tags
    .map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      slug: tag.slug,
    }))
    .filter(Boolean);
  const tags = data?.tags ?? [];

  if (tags.length === 0) return null;
  return <TagArea tagNames={tagNames} onMore={() => open(isbn13, 'detail')} scope={'detail'} />;
};

export default DetailBookmarkTags;
