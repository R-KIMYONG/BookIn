import { MypageUserInfo } from '@/types/userInfo.type';
import MyBooksTabs from './MyBooksTabs';
import AppPagination from '@/components/common/AppPagination';
import { COMMENTS_PAGE_SIZE } from '@/constants/pagination';
import CommentBooksList from './lists/CommentBooksList';
import LikeBooksList from './lists/LikeBooksList';
import BookmarkBooksList from './lists/BookmarkBooksList';
import { useMyBooks } from '@/hooks/url/useMyBooks';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import MyBooksSectionSkeleton from './MyBooksSectionSkeleton';
import { useEffect, useMemo, useState } from 'react';
import { useFetchLikes } from '@/hooks/like/useFetchLikes';
import { useFetchBookmark } from '@/hooks/bookmark/useFetchBookmark';
import MyBooksToolbar from './MyBooksToolbar';
import { useMypageQueryState } from '@/hooks/useMypageQueryState';
import { useDebounce } from '@/hooks/useDebounce';
import { useUserTags } from '@/hooks/bookmark/useUserTags';

type EmptyContext = {
  tab: 'comment' | 'like' | 'bookmark';
  search?: string;
  searchField?: string;
  filter?: string;
  tagId?: string;
  tagName?: string | null;
};

const getMyBooksEmptyMessage = ({ tab, search, searchField, filter, tagId, tagName }: EmptyContext) => {
  // 검색 있는 경우
  const fieldMap = {
    title: '제목',
    author: '저자',
    memo: '메모',
    content: '댓글',
  };

  if (search) {
    const field = fieldMap[searchField as keyof typeof fieldMap] ?? '검색어';
    return {
      emptyStateTitle: '검색 결과가 없습니다',
      emptyStateDescription: `${field}: "${search}"에 대한 결과가 없습니다.`,
    };
  }
  // 태그 필터
  if (tagId) {
    if (!tagName) {
      return {
        emptyStateTitle: '잘못된 접근',
        emptyStateDescription: '존재하지 않는 태그입니다.',
      };
    }
    return {
      emptyStateTitle: '태그 결과 없음',
      emptyStateDescription: `"${tagName}" 태그에 해당하는 책이 없습니다.`,
    };
  }
  // 메모 필터
  if (filter === 'memo') {
    return {
      emptyStateTitle: '메모 없음',
      emptyStateDescription: '메모가 있는 책이 없습니다.',
    };
  }
  if (filter === 'no_memo') {
    return {
      emptyStateTitle: '메모 없음',
      emptyStateDescription: '메모가 없는 책이 없습니다.',
    };
  }
  // 기본 상태
  switch (tab) {
    case 'comment':
      return {
        emptyStateTitle: '댓글 없음',
        emptyStateDescription: '아직 댓글을 남긴 책이 없습니다.',
      };
    case 'like':
      return {
        emptyStateTitle: '좋아요 없음',
        emptyStateDescription: '좋아요한 책이 없습니다.',
      };
    case 'bookmark':
      return {
        emptyStateTitle: '북마크 없음',
        emptyStateDescription: '북마크한 책이 없습니다.',
      };
  }
};

type ErrorContext = {
  tab: 'comment' | 'like' | 'bookmark';
  error?: Error | null;
  tagId?: string;
  tagName?: string | null;
  search?: string;
  searchField?: string;
  refetch: () => void;
  setQuery: (v: any) => void;
};

const getMyBooksErrorMessage = ({
  tab,
  error,
  tagId,
  tagName,
  search,
  searchField,
  refetch,
  setQuery,
}: ErrorContext) => {
  // 잘못된 태그 (사전 방어 못한 경우)
  if (tagId && !tagName) {
    return {
      errorTitle: '잘못된 요청',
      errorDescription: '존재하지 않는 태그입니다.',
      action: {
        label: '전체 보기',
        onClick: () => setQuery({ tagId: undefined }),
      },
    };
  }

  // 검색 중 에러
  if (search) {
    const fieldMap = {
      title: '제목',
      author: '저자',
      memo: '메모',
      content: '댓글',
    };

    const field = fieldMap[searchField as keyof typeof fieldMap] ?? '검색어';

    return {
      errorTitle: '검색 중 오류 발생',
      errorDescription: `${field} 검색 중 문제가 발생했습니다.`,
      action: {
        label: '다시 시도',
        onClick: () => refetch(),
      },
    };
  }

  // 기본 tab별 메시지
  switch (tab) {
    case 'comment':
      return {
        errorTitle: '댓글 로딩 실패',
        errorDescription: '댓글 정보를 불러오는 중 문제가 발생했습니다.',
        action: {
          label: '재시도',
          onClick: () => refetch(),
        },
      };
    case 'like':
      return {
        errorTitle: '좋아요 로딩 실패',
        errorDescription: '좋아요 목록을 불러오는 중 문제가 발생했습니다.',
        action: {
          label: '재시도',
          onClick: () => refetch(),
        },
      };
    case 'bookmark':
      return {
        errorTitle: '북마크 로딩 실패',
        errorDescription: '북마크 목록을 불러오는 중 문제가 발생했습니다.',
        action: {
          label: '재시도',
          onClick: () => refetch(),
        },
      };
    default:
      return {
        errorTitle: '오류 발생',
        errorDescription: error?.message ?? '데이터를 불러오지 못했습니다.',
        action: {
          label: '재시도',
          onClick: () => refetch(),
        },
      };
  }
};

const MyBooksSection = ({ userInfo }: { userInfo: MypageUserInfo }) => {
  const { query, setQuery } = useMypageQueryState();
  const { tab, sort, filter, page, search, searchField, tagId } = query;
  const [localSearch, setLocalSearch] = useState(search);

  const { data: userTags } = useUserTags(userInfo.id);

  const debouncedSearch = useDebounce(localSearch, 500);
  useEffect(() => {
    if (debouncedSearch === search) return;

    setQuery({ search: debouncedSearch });
  }, [debouncedSearch, search, setQuery]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const { result, isPending, isError, error, refetch } = useMyBooks(
    tab,
    userInfo.id,
    page,
    sort,
    filter,
    search,
    searchField,
    tagId
  );

  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / COMMENTS_PAGE_SIZE));

  useEffect(() => {
    if (!result || totalPages === 0) return;

    if (page > totalPages && page !== totalPages) {
      setQuery({ page: totalPages });
    }
  }, [result, page, totalPages, setQuery]);

  const isbnList = useMemo(() => {
    return result?.data.map((item) => item.isbn13) ?? [];
  }, [result?.data]);

  useFetchLikes(tab === 'like' ? isbnList : []);
  useFetchBookmark(tab === 'bookmark' ? isbnList : []);

  const tagNameMap = useMemo(() => {
    const map = new Map<string, string>();
    userTags?.forEach((t) => {
      if (t.id) map.set(t.id, t.name);
    });
    return map;
  }, [userTags]);

  const tagName = tagId ? tagNameMap.get(tagId) : null;

  const { emptyStateTitle, emptyStateDescription } = getMyBooksEmptyMessage({
    tab,
    search,
    searchField,
    filter,
    tagId,
    tagName,
  });

  const { errorTitle, errorDescription, action } = getMyBooksErrorMessage({
    tab,
    error: error,
    tagId,
    tagName,
    search,
    searchField,
    refetch,
    setQuery,
  });

  if (!result) {
    return (
      <>
        <MyBooksTabs tab={tab} onChange={(next) => setQuery({ tab: next })} />
        <MyBooksToolbar
          tab={tab}
          search={localSearch}
          onSearchChange={setLocalSearch}
          searchField={query.searchField}
          onSearchFieldChange={(v) => setQuery({ searchField: v })}
          sort={sort}
          onSortChange={(v) => setQuery({ sort: v })}
          filter={filter}
          onFilterChange={(v) => setQuery({ filter: v })}
          userTags={userTags ?? []}
          tag={tagId}
          onTagChange={(v) => setQuery({ tagId: v })}
        />
        <div className="my-2 lg:h-[calc(300px*2+16px)]">
          <MyBooksSectionSkeleton />
        </div>
      </>
    );
  }

  const renderList = () => {
    if (result.tab !== tab) return null;
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
      <MyBooksTabs tab={tab} onChange={(next) => setQuery({ tab: next })} />
      <MyBooksToolbar
        tab={tab}
        search={localSearch}
        onSearchChange={setLocalSearch}
        searchField={query.searchField}
        onSearchFieldChange={(v) => setQuery({ searchField: v })}
        sort={sort}
        onSortChange={(v) => setQuery({ sort: v })}
        filter={filter}
        onFilterChange={(v) => setQuery({ filter: v })}
        userTags={userTags ?? []}
        tag={tagId}
        onTagChange={(v) => setQuery({ tagId: v })}
      />
      <div className="my-2 min-h-[600px]">
        {isPending ? (
          <MyBooksSectionSkeleton />
        ) : isError ? (
          <ErrorState title={errorTitle} description={errorDescription} action={action} />
        ) : result.data.length === 0 ? (
          <EmptyState description={emptyStateDescription} title={emptyStateTitle} />
        ) : (
          renderList()
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <AppPagination
          page={page}
          onChange={(p) => {
            setQuery({ page: p });
          }}
          totalPages={totalPages}
        />
      </div>
    </>
  );
};

export default MyBooksSection;
