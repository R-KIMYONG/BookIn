'use client';

import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import MyBooksSectionSkeleton from './MyBooksSectionSkeleton';
import { getMyBooksEmptyMessage, getMyBooksErrorMessage } from './MyBooksMessage';
import { useMypageQueryState } from '@/hooks/mypage/useMypageQueryState';
import { useMyBooks } from '@/hooks/mybooks/useMyBooks';
import { useUserTags } from '@/hooks/bookmark/useUserTags';
import { useMemo } from 'react';
import { useFetchLikeCount } from '@/hooks/like/useFetchLikeCount';
import dynamic from 'next/dynamic';

const CommentBooksList = dynamic(() => import('./lists/CommentBooksList'));

const LikeBooksList = dynamic(() => import('./lists/LikeBooksList'));

const BookmarkBooksList = dynamic(() => import('./lists/BookmarkBooksList'));
const MyBooksSection = () => {
  const { query, setQuery } = useMypageQueryState();

  const { tab, page, sort, filter, search, searchField, tagId } = query;

  const { result, isPending, isError, error, refetch } = useMyBooks(
    tab,
    page,
    sort,
    filter,
    search,
    searchField,
    tagId
  );

  const { data: userTags } = useUserTags();

  const tagName = userTags?.find((t) => t.id === tagId)?.name ?? null;

  const isbnList = useMemo(() => {
    return result?.data.map((item) => item.isbn13) ?? [];
  }, [result?.data]);

  useFetchLikeCount(tab === 'like' ? isbnList : []);
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
  const renderList = () => {
    if (!result || result.tab !== tab) return null;
    switch (result.tab) {
      case 'comment':
        return <CommentBooksList data={result.data} />;
      case 'like':
        return <LikeBooksList data={result.data} />;
      case 'bookmark':
        return <BookmarkBooksList data={result.data} />;
    }
  };
  if (isPending) {
    return (
      <div className="my-2 min-h-[600px]">
        <MyBooksSectionSkeleton />
      </div>
    );
  }

  if (isError) {
    return <ErrorState title={errorTitle} description={errorDescription} action={action} />;
  }

  if (!result || result.data.length === 0) {
    return <EmptyState description={emptyStateDescription} title={emptyStateTitle} />;
  }

  return <div className="my-2 min-h-[200px] flex justify-center lg:min-h-[600px]">{renderList()}</div>;
};

export default MyBooksSection;
