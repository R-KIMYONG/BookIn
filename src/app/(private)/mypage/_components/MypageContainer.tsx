import Mypage from './Mypage';
import { getUserInfoServer } from '@/app/lib/auth/getUserInfoServer';
import { redirect } from 'next/navigation';

const MypageContainer = async () => {
  const userInfo = await getUserInfoServer();

  if (!userInfo) redirect('/login');

  return <Mypage userInfo={userInfo} />;
};

export default MypageContainer;
