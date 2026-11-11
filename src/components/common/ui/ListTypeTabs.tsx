import { Yes24ListType } from '@/shared/lib/yes24/types';
import Button from './Button';
import { YES24_LIST_LABEL } from '@/shared/lib/yes24/constants';
type ListTypeTabsProps = {
  tabs: Yes24ListType[];
  active: Yes24ListType;
  onChange: (tab: Yes24ListType) => void;
};

const ListTypeTabs = ({ tabs, active, onChange }: ListTypeTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 py-1">
      {tabs.map((tab) => (
        <Button
          key={tab}
          size="xs"
          variant={tab === active ? 'primary' : 'secondary'}
          label={YES24_LIST_LABEL[tab]}
          aria-pressed={tab === active}
          onClick={() => {
            if (tab !== active) onChange(tab);
          }}
          disabled={tab === active}
          className="!px-2 !py-1 !text-xs"
        />
      ))}
    </div>
  );
};

export default ListTypeTabs;
