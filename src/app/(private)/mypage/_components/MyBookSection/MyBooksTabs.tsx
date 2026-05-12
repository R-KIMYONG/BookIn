import Button from '@/components/common/ui/Button';
import { MyBooksTabType } from '@/shared/domain/mypage/tab';

const MyBooksTabs = ({ tab, onChange }: { tab: MyBooksTabType; onChange: (tab: MyBooksTabType) => void }) => {
  const myBooksTabs: { label: string; value: MyBooksTabType }[] = [
    { label: '좋아요', value: 'like' },
    { label: '북마크', value: 'bookmark' },
    { label: '댓글', value: 'comment' },
  ];
  return (
    <div className="flex gap-3 p-1 rounded-xl w-fit" role="tablist">
      {myBooksTabs.map((t) => {
        const isActive = tab === t.value;
        return (
          <Button
            key={t.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              if (tab !== t.value) {
                onChange(t.value);
              }
            }}
            variant={isActive ? 'primary' : 'secondary'}
          >
            {t.label}
          </Button>
        );
      })}
    </div>
  );
};

export default MyBooksTabs;
