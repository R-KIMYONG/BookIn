import ButtonComponent from '@/components/common/ui/ButtonComponent';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';
import { MypageSectionType } from '@/types/useMypageUrlState.type';

const SidebarTabs = () => {
  const { mypageSection, setMypageUrl } = useMypageUrlState();
  const profileTabs: { label: string; sectionType: MypageSectionType }[] = [
    { label: '내 활동 책', sectionType: 'myBooks' },
    // 추후 탭 생기면 여기에 추가   (src/types/useMypageUrlState.type.ts 에 타입 추가 필요)
  ];
  return (
    <div className="px-3 py-3">
      <nav>
        <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {profileTabs.map((tab) => {
            const isActive = mypageSection === tab.sectionType;

            return (
              <li key={tab.sectionType}>
                <ButtonComponent
                  className={`!rounded-2xl !border !transition-all
                            ${
                              isActive
                                ? '!border-[#af5858] !bg-[#af5858] !text-white'
                                : '!border-gray-200 !bg-white !text-gray-700 hover:!border-[#af5858] hover:!text-[#af5858]'
                            }`}
                  size="md"
                  fullWidth={true}
                  variant="ghost"
                  onClick={() => {
                    if (mypageSection !== tab.sectionType) {
                      setMypageUrl({
                        section: tab.sectionType,
                        page: 1,
                      });
                    }
                  }}
                  label={tab.label}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarTabs;
