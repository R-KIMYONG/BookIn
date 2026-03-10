import { QueryType } from '@/types/useListUrlState.type';
import ButtonComponent from '../ButtonComponent';

type QueryTypeTabsProps = {
  value: QueryType;
  onChange: (next: QueryType) => void;
  disable?: boolean;
  target?: 'Book' | 'Foreign' | 'eBook';
};

const ALL_TABS: { key: QueryType; label: string }[] = [
  { key: 'Bestseller', label: '베스트셀러' },
  { key: 'ItemNewAll', label: '새로 나온 책' },
  { key: 'ItemNewSpecial', label: '화제의 책' },
  { key: 'BlogBest', label: '베스트 예감' },
  { key: 'ItemEditorChoice', label: '편집자 추천' },
];
const QueryTypeTabs = ({ value, onChange, disable, target }: QueryTypeTabsProps) => {
  const tabs = target && target !== 'Book' ? ALL_TABS.filter((t) => t.key !== 'BlogBest') : ALL_TABS;

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
        {tabs.map((t) => {
          const active = t.key === value;
          return (
            <ButtonComponent
              key={t.key}
              size="xs"
              variant={active ? 'primary' : 'secondary'}
              label={t.label}
              onClick={() => onChange(t.key)}
              loadingText="요청중..."
              disabled={disable}
            />
          );
        })}
      </div>
    </>
  );
};
export default QueryTypeTabs;
