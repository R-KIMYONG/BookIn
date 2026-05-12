import { MypageUserInfo } from '@/shared/domain/user/types';
import ProfileCard from './ProfileCard';
import SidebarTabs from './SidebarTabs';

const MypageSidebar = ({ userInfo }: { userInfo: MypageUserInfo }) => {
  return (
    <>
      <ProfileCard userInfo={userInfo} />
      <SidebarTabs />
    </>
  );
};

export default MypageSidebar;
