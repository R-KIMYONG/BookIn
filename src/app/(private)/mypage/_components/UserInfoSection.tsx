import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Mypage from './Mypage';

import { createClient } from '@/utils/supabase/server';
import { getUserInfoServer } from '@/app/lib/auth/getUserInfoServer';

const UserInfoSection = async () => {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  if (!user) throw new Error('로그인 사용자 정보가 없습니다.');

  await queryClient.prefetchQuery({
    queryKey: ['userInfo', user.id],
    queryFn: () => getUserInfoServer(user.id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Mypage userId={user.id} />
    </HydrationBoundary>
  );
};

export default UserInfoSection;
