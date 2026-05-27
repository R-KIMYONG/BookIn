import { MypageSectionType } from '@/shared/domain/mypage/section';
import ProfileCard from './ProfileCard';
import SidebarTabs from './SidebarTabs';

const MypageSidebar = ({ section }: { section: MypageSectionType }) => {
  return (
    <>
      <ProfileCard />
      <SidebarTabs section={section}/>
    </>
  );
};

export default MypageSidebar;
