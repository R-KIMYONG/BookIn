import type { Metadata } from 'next';
import MypageSettings from './_components/MypageSettings';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { userKeys } from '@/shared/domain/user/queryKeys';
import { getUserInfoServer } from '@/shared/lib/server/entities/getUserInfoServer';

export const metadata: Metadata = {
  title: '계정 설정',
  description: '프로필, 계정, 보안 정보를 수정할 수 있습니다.',
};

const MypageSettingsPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: userKeys.me(),
    queryFn: getUserInfoServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MypageSettings />
    </HydrationBoundary>
  );
};

export default MypageSettingsPage;
