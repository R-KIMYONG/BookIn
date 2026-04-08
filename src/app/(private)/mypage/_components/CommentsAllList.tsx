import { Mycommentlist } from '@/types/mypageCommentslist.type';
import { createClient } from '@/utils/supabase/client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { CommentsListProps } from '@/types/Bookcomments';
import { useEffect } from 'react';
import CommentsSkeleton from './CommentsSkeleton';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { COMMENTS_PAGE_SIZE } from '@/constants/pagination';

const CommentsAllList = ({ userInfo, currentPage, setTotalPages }: CommentsListProps) => {
  const supabase = createClient();
  const {
    data: myCommentslist,
    isPending,
    isError,
  } = useQuery<Mycommentlist, Error, Mycommentlist, [string, string, number]>({
    queryKey: ['myComments', userInfo.id, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * COMMENTS_PAGE_SIZE;
      const to = from + COMMENTS_PAGE_SIZE - 1;
      try {
        const { data, count, error } = await supabase
          .from('comments')
          .select('*', { count: 'exact' })
          .eq('user_id', userInfo.id)
          .range(from, to);
        if (error) {
          throw error;
        }
        return { data: data ?? [], total: count ?? 0 } as Mycommentlist;
      } catch (error) {
        if (error instanceof Error) {
          console.error('Supabase에서 에러 발생:', error);
        }
        console.error('예상치 못한 에러 발생:', error);
        throw error;
      }
    },
    enabled: !!userInfo.id,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
  const totalPages = Math.max(1, Math.ceil((myCommentslist?.total ?? 0) / COMMENTS_PAGE_SIZE));
  useEffect(() => {
    if (!isPending && !isError) setTotalPages(totalPages);
  }, [totalPages, isPending, isError, setTotalPages]);

  if (isPending) return <CommentsSkeleton />;
  if (isError) return <ErrorState />;
  if (!myCommentslist || myCommentslist.data.length === 0)
    return <EmptyState description="댓글 남긴 기록이 없습니다." />;
  return (
    <ul className="grid w-full content-start gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {myCommentslist.data.map((item) => (
        <li key={item.id}>
          <Link href={`/${item.post_id}`}>
            <div className="relative h-52 overflow-hidden rounded-xl">
   
              <Image alt={item.post_id} className="object-cover" src={item.cover || '/noImg.png'} fill priority />

        
              <div className="absolute inset-0 bg-black/50" />

  
              <div className="absolute top-0 z-10 p-3 w-full">
                <p
                  dangerouslySetInnerHTML={{ __html: item.content || '' }}
                  className="text-[10px] text-white/70 line-clamp-4"
                />
              </div>

       
              <div className="absolute bottom-0 z-10 w-full bg-white/20 p-2">
                <p className="text-black text-[10px] font-bold">{userInfo.nickname}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CommentsAllList;
