import ButtonComponent from '@/components/common/ButtonComponent';
import { CommentsTabType, CommentTabsProps } from '@/types/Bookcomments';

const CommentTabs = ({ activeTab, setActiveTab }: CommentTabsProps) => {
  const commentTabs: { id: CommentsTabType; label: string }[] = [
    { id: 'byBook', label: '책별 댓글' },
    { id: 'all', label: '내 댓글' },
  ];
  return (
    <div className="flex items-stretch gap-2 px-4 box-border">
      {commentTabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <ButtonComponent
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
            }}
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
