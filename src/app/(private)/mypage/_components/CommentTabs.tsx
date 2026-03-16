import ButtonComponent from '@/components/common/ButtonComponent';
import {CommentTabsProps } from '@/types/Bookcomments';
import { CommentTabType } from '@/types/useMypageUrlState.type';

const CommentTabs = ({ activeTab, setActiveTab }: CommentTabsProps) => {
  const commentTabs: { id: CommentTabType; label: string }[] = [
    { id: 'commentByBook', label: '책별 댓글' },
    { id: 'commentAll', label: '내 댓글' },
  ];
  return (
    <div className="flex items-stretch gap-2 px-4 box-border">
      {commentTabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <ButtonComponent
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="!flex-1 !font-medium !transition"
            variant={active ? 'primary' : 'secondary'}
            aria-pressed={active}
            label={tab.label}
          />
        );
      })}
    </div>
  );
};

export default CommentTabs;
