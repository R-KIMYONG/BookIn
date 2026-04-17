import { MypageUserInfo } from '@/types/userInfo.type';
import MyBooksTabs from './MyBooksTabs';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';
import AppPagination from '@/components/common/AppPagination';
import { COMMENTS_PAGE_SIZE } from '@/constants/pagination';
import CommentBooksList from './lists/CommentBooksList';
import LikeBooksList from './lists/LikeBooksList';
import BookmarkBooksList from './lists/BookmarkBooksList';
import { useMyBooks } from '@/hooks/url/useMyBooks';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import MyBooksSectionSkeleton from './MyBooksSectionSkeleton';
import { MyBooksTabType } from '@/types/useMypageUrlState.type';
import { useEffect, useMemo, useState } from 'react';
import { useFetchLikes } from '@/hooks/useFetchLikes';

const MyBooksSection = ({ userInfo }: { userInfo: MypageUserInfo }) => {
  const { tab: urlTab, page, setMypageUrl } = useMypageUrlState();

  const [activeTab, setActiveTab] = useState<MyBooksTabType>(urlTab);
  const { result, isPending, isError } = useMyBooks(urlTab, userInfo.id, page);

  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / COMMENTS_PAGE_SIZE));
  const isTabSwitching = activeTab !== urlTab;
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  const isbnList = useMemo(() => {
    return result?.data.map((item) => item.isbn13) ?? [];
  }, [result?.data]);

  useFetchLikes(activeTab === 'like' ? isbnList : []);

  if (!result) {
    return (
      <>
        <MyBooksTabs tab={activeTab} onChange={setActiveTab} />
        <div className="my-2 lg:h-[calc(160px*2+16px)]">
          <MyBooksSectionSkeleton />
        </div>
      </>
    );
  }

  const TAB_CONFIG = {
    comment: {
      empty: '아직 댓글을 남긴 책이 없습니다.',
      error: '댓글 정보를 불러오지 못했습니다.',
    },
    like: {
      empty: '좋아요한 책이 없습니다.',
      error: '좋아요 목록을 불러오지 못했습니다.',
    },
    bookmark: {
      empty: '북마크한 책이 없습니다.',
      error: '북마크 목록을 불러오지 못했습니다.',
    },
  } as const;

  const renderList = () => {
    if (result.tab !== activeTab) return null;
    switch (result.tab) {
      case 'comment':
        return <CommentBooksList data={result.data} />;
      case 'like':
        return <LikeBooksList data={result.data} />;
      case 'bookmark':
        return <BookmarkBooksList data={result.data} />;
    }
  };

  return (
    <>
      <MyBooksTabs tab={activeTab} onChange={setActiveTab} />
      <div className="my-2 lg:h-[calc(160px*2+16px)]">
        {isTabSwitching || isPending ? (
          <MyBooksSectionSkeleton />
        ) : isError ? (
          <ErrorState message={TAB_CONFIG[activeTab].error} />
        ) : result.data.length === 0 ? (
          <EmptyState description={TAB_CONFIG[activeTab].empty} />
        ) : (
          renderList()
        )}
      </div>
      <AppPagination
        page={page}
        onChange={(p) => {
          setMypageUrl({ page: p });
        }}
        totalPages={totalPages}
      />
    </>
  );
};

export default MyBooksSection;
