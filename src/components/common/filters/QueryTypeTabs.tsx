import { QueryType } from '@/shared/domain/aladin/types';
import Button from '../ui/Button';
import { TargetTypes } from '@/shared/constants/category';
import { ALL_TABS } from '@/shared/domain/aladin/constants';

type QueryTypeTabsProps = {
  value: QueryType;
  onChange: (next: QueryType) => void;
  disable?: boolean;
  target?: TargetTypes;
};

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
