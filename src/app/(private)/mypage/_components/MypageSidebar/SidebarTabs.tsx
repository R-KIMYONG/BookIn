import ButtonComponent from '@/components/common/ui/ButtonComponent';
import { useMypageQueryState } from '@/hooks/useMypageQueryState';
import { MypageSectionType } from '@/types/useMypageUrlState.type';

const SidebarTabs = () => {
  const { query, setQuery } = useMypageQueryState();
  const profileTabs: { label: string; sectionType: MypageSectionType }[] = [
    { label: '내 활동 책', sectionType: 'myBooks' },
    { label: '내 취향 추천', sectionType: 'recommend' },
    // 추후 탭 생기면 여기에 추가   (src/types/useMypageUrlState.type.ts 에 타입 추가 필요)
  ];
  return (
    <div className="px-3 py-3">
      <nav>
        <ul className="flex flex-wrap gap-2">
          {profileTabs.map((tab) => {
            const isActive = query.section === tab.sectionType;

            return (
              <li key={tab.sectionType}>
                <ButtonComponent
                  size="sm"
                  fullWidth={true}
                  variant={isActive ? 'primary' : 'secondary'}
                  onClick={() => {
                    if (query.section !== tab.sectionType) {
                      setQuery({ section: tab.sectionType, page: 1 });
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
