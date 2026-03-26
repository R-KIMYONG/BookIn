'use client';

import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import CommentsSkeleton from './CommentsSkeleton';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useEffect } from 'react';
import { CommentsByBookResult, CommentsListProps } from '@/types/Bookcomments';
import { pageSize } from './BookComments';

const CommentsByBook = ({ userInfo, currentPage, setTotalPages }: CommentsListProps) => {
  const supabase = createClient();
  const {
    data: booksList,
    isPending,
    isError,
  } = useQuery<CommentsByBookResult>({
    queryKey: ['commentsByBook', userInfo.id, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, count, error } = await supabase
        .from('user_book_comments')
        .select('post_id,book_title,book_cover,comment_count,last_commented_at', { count: 'exact' })
        .eq('user_id', userInfo.id)
        .order('last_commented_at', { ascending: false })
        .range(from, to);
      if (error) throw error;

      const books = (data ?? []).map((item) => ({
        post_id: item.post_id ?? '',
        title: item.book_title ?? '',
        cover: item.book_cover ?? '/noImg.png',
        comment_count: item.comment_count ?? 0,
        last_commented_at: item.last_commented_at ?? '',
      }));
      return { data: books, total: count ?? 0 };
    },
    enabled: !!userInfo.id,
    staleTime: 60_000,
  });
  const totalPages = Math.max(1, Math.ceil((booksList?.total ?? 0) / pageSize));

  useEffect(() => {
    if (!isPending && !isError) setTotalPages(totalPages);
  }, [totalPages, isPending, isError, setTotalPages]);
  if (isPending) return <CommentsSkeleton />;
  if (isError) return <ErrorState message="책별 댓글 데이터를 불러오지 못했습니다." />;
  if (!booksList || booksList.data.length === 0) return <EmptyState description="책별 댓글 기록이 없습니다." />;
  return (
    <ul className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {booksList.data.map((book) => {
        const date = dayjs(book.last_commented_at).locale('ko').format('YYYY-MM-DD HH:mm');
        return (
          <li key={book.post_id}>
            <Link href={`/${book.post_id}`}>
              <Card className="h-40 relative overflow-hidden">
                <Image src={book.cover} alt={book.title} fill className="object-cover" />

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-bold line-clamp-1 text-xs">{book.title}</p>

                  <div className="flex flex-col justify-between text-xs mt-1">
                    <span>댓글 {book.comment_count}개</span>
                    <span>{book.last_commented_at ? date : ''}</span>
                  </div>
                </div>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default CommentsByBook;
