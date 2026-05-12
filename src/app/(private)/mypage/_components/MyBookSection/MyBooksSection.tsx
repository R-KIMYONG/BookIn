import { MypageUserInfo } from '@/shared/domain/user/types';
import MyBooksTabs from './MyBooksTabs';
import AppPagination from '@/components/common/AppPagination';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';
import CommentBooksList from './lists/CommentBooksList';
import LikeBooksList from './lists/LikeBooksList';
import BookmarkBooksList from './lists/BookmarkBooksList';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import MyBooksSectionSkeleton from './MyBooksSectionSkeleton';
import { useEffect, useMemo, useState } from 'react';
import { useFetchLikes } from '@/hooks/like/useFetchLikes';
import { useFetchBookmark } from '@/hooks/bookmark/useFetchBookmark';
import MyBooksToolbar from './MyBooksToolbar';
import { useMypageQueryState } from '@/hooks/mypage/useMypageQueryState';
import { useDebounce } from '@/hooks/common/useDebounce';
import { useUserTags } from '@/hooks/bookmark/useUserTags';
import { getMyBooksEmptyMessage, getMyBooksErrorMessage } from './MyBooksMessage';
import { useMyBooks } from '@/hooks/mybooks/useMyBooks';
import { useFetchLikeCount } from '@/hooks/like/useFetchLikeCount';

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

  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / DEFAULT_PAGE_SIZE));

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
  useFetchLikeCount(tab === 'like' ? isbnList : []);
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
        <div className="my-2 min-h-[600px]">
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
      <div
        className={`my-2 min-h-[200px] flex justify-center ${result.data.length === 0 ? 'items-center lg:min-h-[200px]' : 'lg:min-h-[600px]'}`}
      >
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
