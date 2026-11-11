import React from 'react';
import RecentBooks from './RecentBooks';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getRecentBooks } from '@/shared/lib/server/entities/getRecentBooks';
import { recentbookKeys } from '@/shared/domain/recentbooks/queryKeys';

const RecentBooksServer = async () => {
  const queryClient = new QueryClient();

  try {
    const recentBooks = await getRecentBooks();

    queryClient.setQueryData(recentbookKeys.list(), recentBooks);
  } catch (error) {
    console.error('최근 본 책 조회 실패', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecentBooks />
    </HydrationBoundary>
  );
};

export default RecentBooksServer;
