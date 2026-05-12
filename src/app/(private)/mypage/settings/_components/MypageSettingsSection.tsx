import { getUserInfoServer } from '@/shared/lib/auth/getUserInfoServer';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import MypageSettings from './MypageSettings';
import { redirect } from 'next/navigation';

const MypageSettingsSection = async () => {
  const queryClient = new QueryClient();
  const userInfo = await getUserInfoServer();
  if (!userInfo) redirect('/login');

  await queryClient.prefetchQuery({
    queryKey: ['userInfo', userInfo.id],
    queryFn: () => userInfo,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MypageSettings userId={userInfo.id} />
    </HydrationBoundary>
  );
};

export default MypageSettingsSection;
