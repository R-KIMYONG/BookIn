import { QueryType } from '@/shared/domain/aladin/constants';
import Button from '../ui/Button';

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
    <div className="flex flex-wrap gap-2 py-1">
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <Button
            key={t.key}
            size="xs"
            variant={active ? 'primary' : 'secondary'}
            label={t.label}
            onClick={() => onChange(t.key)}
            loadingText="요청중..."
            disabled={disable || active}
            className="!px-2 !py-1 !text-xs !sm:px-3 !sm:text-sm !md:px-4 !md:text-base"
          />
        );
      })}
    </div>
  );
};
export default QueryTypeTabs;
