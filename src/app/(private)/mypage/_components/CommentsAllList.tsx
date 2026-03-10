import { Mycommentlist } from '@/types/mypageCommentslist.type';
import { createClient } from '@/utils/supabase/client';
import { Card, CardFooter, CardHeader } from '@nextui-org/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { pageSize } from './BookComments';
import { CommentsListProps } from '@/types/Bookcomments';
import { useEffect } from 'react';
import CommentsSkeleton from './CommentsSkeleton';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

const CommentsAllList = ({ userInfo, currentPage, setTotalPages }: CommentsListProps) => {
  const supabase = createClient();
  const {
    data: myCommentslist,
    isPending,
    isError,
  } = useQuery<Mycommentlist, Error, Mycommentlist, [string, string, number]>({
    queryKey: ['myComments', userInfo.id, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
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
  const totalPages = Math.max(1, Math.ceil((myCommentslist?.total ?? 0) / pageSize));
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
          {
            <Link href={`/${item.post_id}`}>
              <Card isFooterBlurred className="h-52">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                  <h5 className="text-white font-medium text-xl mb-1 h-[30px] truncate w-full">{item.title}</h5>
                  <p
                    dangerouslySetInnerHTML={{ __html: item.content || '' }}
                    className="text-tiny text-white/60 uppercase font-bold w-full text-ellipsis overflow-hidden line-clamp-6"
                  />
                </CardHeader>
                <div className="relative w-full h-full">
                  <Image alt={item.title} className="object-cover" src={item.cover || '/noImg.png'} fill priority />
                  <div className="bg-black/50 w-full h-full absolute top-0 left-0"></div>
                </div>
                <CardFooter className="absolute bg-white/20 bottom-0 border-t-1 border-zinc-100/80 z-10 justify-between">
                  <div>
                    <p className="text-black text-tiny font-bold">{userInfo.nickname}</p>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          }
        </li>
      ))}
    </ul>
  );
};

export default CommentsAllList;
