import { bookListKeys } from '@/shared/domain/book/queryKeys';
import { HOME_LIST_SIZE, HOME_SECTIONS } from '@/shared/lib/yes24/constants';
import { getYes24List } from '@/shared/lib/yes24/getYes24List';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import HomeBookSection from './HomeBookSection';
import { prefetchBookInteractions } from '@/shared/lib/server/entities/prefetchBookInteractions';

type HomeBookSectionProps = {
  section: (typeof HOME_SECTIONS)[number];
};
const HomeBookSectionServer = async ({ section }: HomeBookSectionProps) => {
  const { title, categoryId, tabs } = section;
  const listType = tabs[0];
  const queryClient = new QueryClient();

  try {
    const list = await getYes24List({ listType, categoryId, pageSize: HOME_LIST_SIZE });
    queryClient.setQueryData(bookListKeys.list({ listType, categoryId, page: 1, pageSize: HOME_LIST_SIZE }), list);

    await prefetchBookInteractions(
      queryClient,
      list.items.map((book) => book.itemId)
    );
  } catch (error) {
    console.error(`${title} 목록 조회 실패`, error);
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeBookSection section={section} />
    </HydrationBoundary>
  );
};

export default HomeBookSectionServer;
