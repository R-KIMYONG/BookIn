'use client';
import React, { useState } from 'react';
import { UserInfoPropsType } from '@/types/userInfo.type';
import CommentTabs from './CommentTabs';
import CommentsAllList from './CommentsAllList';
import CommentsByBook from './CommentsByBook';
import AppPagination from '@/components/common/AppPagination';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';
export const pageSize = 10; //한페이지에 패칭할 카드수량
const BookComments = ({ userInfo }: UserInfoPropsType): React.JSX.Element => {
  const [totalPages, setTotalPages] = useState<number>(1);
  const { mypageQueryType, page, setMypageUrl } = useMypageUrlState();

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 border-b bg-white/80 backdrop-blur py-2 box-border">
        <CommentTabs
          activeTab={mypageQueryType === 'commentAll' ? 'all' : 'byBook'}
          setActiveTab={(tab) => {
            setTotalPages(1);
            setMypageUrl({ queryType: tab === 'all' ? 'commentAll' : 'commentByBook', page: 1 });
          }}
        />
      </div>
      <div className="flex-1 p-2">
        {mypageQueryType === 'commentAll' ? (
          <CommentsAllList userInfo={userInfo} currentPage={page} setTotalPages={setTotalPages} />
        ) : (
          <CommentsByBook userInfo={userInfo} currentPage={page} setTotalPages={setTotalPages} />
        )}
      </div>
      <div className="shrink-0 border-t bg-white/80 backdrop-blur px-4 py-2">
        <AppPagination page={page} totalPages={totalPages} onChange={(p) => setMypageUrl({ page: p })} />
      </div>
    </div>
  );
};

export default BookComments;
