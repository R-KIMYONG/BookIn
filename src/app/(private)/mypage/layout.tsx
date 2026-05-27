import { userKeys } from '@/shared/domain/user/queryKeys';
import { getUserInfoServer } from '@/shared/lib/server/entities/getUserInfoServer';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

const MypageLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const queryClient = new QueryClient();

  const userInfo = await getUserInfoServer();
  if (!userInfo) redirect('/login');

  queryClient.setQueryData(userKeys.me(), userInfo);
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};

export default MypageLayout;
