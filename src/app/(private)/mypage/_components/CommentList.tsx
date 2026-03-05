'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardFooter, Skeleton } from '@nextui-org/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { UserInfoPropsType } from '@/types/userInfo.type';
import Link from 'next/link';
import CoverImg from './CoverImg';
import { Mycommentlist } from '@/types/mypageCommentslist.type';
import AppPagination from '@/components/common/AppPagination';

const CommentList = ({ userInfo }: UserInfoPropsType): React.JSX.Element => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10; //한페이지에 패칭할 카드수량
  const supabase = createClient();
  const {
    data: myCommentslist,
    isPending,
    isError,
  } = useQuery<Mycommentlist, Error, Mycommentlist, [string, number]>({
    queryKey: ['myComments', currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * pageSize;
      const to = currentPage * pageSize - 1;
      try {
        const { data, count, error } = await supabase
          .from('comments')
          .select('*', { count: 'exact' })
          .eq('user_id', userInfo.id)
          .range(from, to);
        if (error) {
          throw error;
        }
        console.log(data);
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
  console.log(myCommentslist?.total);
  const totalPages = Math.max(1, Math.ceil((myCommentslist?.total ?? 0) / pageSize));

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (isPending) {
    return (
      <>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-h-[520px] p-4 box-border">
          {Array.from({ length: pageSize }).map((_, i) => (
            <li key={i}>
              <Card className="w-full space-y-5 p-4" radius="lg">
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300" />
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                  </Skeleton>
                </div>
              </Card>
            </li>
          ))}
        </ul>
        <AppPagination page={currentPage} totalPages={totalPages} onChange={handlePageChange} disabled={isPending} />
      </>
    );
  }
  if (!myCommentslist || myCommentslist.data.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <div className="text-center">
          <p>댓글 남긴 기록이 없습니다.</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center bg-[#af5858] text-white w-[60px] h-[30px] rounded-full text-xs font-bold hover:bg-opacity-80 transition"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }
  if (isError) return <div>error</div>;

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 min-h-0 overflow-auto p-4">
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
                    <CoverImg postId={item.post_id} />
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
      </div>
      <div className="shrink-0 border-t bg-white/80 backdrop-blur px-4 py-3">
        <AppPagination page={currentPage} totalPages={totalPages} onChange={handlePageChange} />
      </div>
    </div>
  );
};

export default CommentList;
