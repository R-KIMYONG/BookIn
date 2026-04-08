'use client';
import React, { ReactElement, useState } from 'react';
import { MypageUserInfo } from '@/types/userInfo.type';
import CommentTabs from './CommentTabs';
import CommentsAllList from './CommentsAllList';
import CommentsByBook from './CommentsByBook';
import AppPagination from '@/components/common/AppPagination';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';
const BookComments = ({ userInfo }: { userInfo: MypageUserInfo }): ReactElement=> {
  const [totalPages, setTotalPages] = useState<number>(1);
  const { commentTab, page, setMypageUrl } = useMypageUrlState();

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 border-b bg-white/80 backdrop-blur py-2 box-border">
        <CommentTabs
          activeTab={commentTab}
          setActiveTab={(tab) => {
            setTotalPages(1);
            setMypageUrl({ commentTab: tab, page: 1 });
          }}
        />
      </div>
      <div className="flex-1 p-2">
        {commentTab === 'commentAll' ? (
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
