import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { COMMENTS_PAGE_SIZE } from '@/constants/pagination';
import { MyBooksTabType } from '@/types/useMypageUrlState.type';
import { getCommentBooks } from '@/app/lib/mybooks/getCommentBooks';
import { getLikeBooks } from '@/app/lib/mybooks/getLikeBooks';
import { getBookmarkBooks } from '@/app/lib/mybooks/getBookmarkBooks';
import { BookmarkBook, CommentBook, LikeBook } from '@/types/myBooks.type';

type MyBooksQueryResult =
  | { tab: 'comment'; data: CommentBook[]; total: number }
  | { tab: 'like'; data: LikeBook[]; total: number }
  | { tab: 'bookmark'; data: BookmarkBook[]; total: number };

export const useMyBooks = (tab: MyBooksTabType, userId: string, page: number) => {
  const supabase = createClient();

  const query = useQuery<MyBooksQueryResult>({
    queryKey: ['myBooks', tab, userId, page],
    queryFn: async () => {
      if (tab === 'comment') {
        const res = await getCommentBooks({ supabase, userId, page, pageSize: COMMENTS_PAGE_SIZE });
        return { tab: 'comment', ...res };
      }
      if (tab === 'like') {
        const res = await getLikeBooks({ supabase, userId, page, pageSize: COMMENTS_PAGE_SIZE });
        return { tab: 'like', ...res };
      }
      const res = await getBookmarkBooks({ supabase, userId, page, pageSize: COMMENTS_PAGE_SIZE });
      return { tab: 'bookmark', ...res };
    },
    enabled: !!userId,
  });
  return {
    ...query,
    result: query.data,
  };
};
