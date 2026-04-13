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

const MyBooksSection = ({ userInfo }: { userInfo: MypageUserInfo }) => {
  const { tab, page, setMypageUrl } = useMypageUrlState();

  const { result, isPending, isError } = useMyBooks(tab, userInfo.id, page);

  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / COMMENTS_PAGE_SIZE));

  if (!result) {
    return (
      <>
        <MyBooksTabs tab={tab} />
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

  return (
    <>
      <MyBooksTabs tab={tab} />
      <div className="my-2 lg:h-[calc(160px*2+16px)]">
        {isError ? (
          <ErrorState message={TAB_CONFIG[tab].error} />
        ) : isPending ? (
          <MyBooksSectionSkeleton />
        ) : result.data.length === 0 ? (
          <EmptyState description={TAB_CONFIG[tab].empty} />
        ) : (
          <>
            {result.tab === 'comment' && <CommentBooksList data={result.data} />}
            {result.tab === 'like' && <LikeBooksList data={result.data} />}
            {result.tab === 'bookmark' && <BookmarkBooksList data={result.data} />}
          </>
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
