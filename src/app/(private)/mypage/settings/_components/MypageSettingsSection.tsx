import { getUserInfoServer } from '@/app/lib/auth/getUserInfoServer';
import { createClient } from '@/utils/supabase/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import MypageSettings from './MypageSettings';

const MypageSettingsSection = async () => {
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
    queryFn: () => getUserInfoServer(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MypageSettings userId={user.id} />
    </HydrationBoundary>
  );
};

export default MypageSettingsSection;
