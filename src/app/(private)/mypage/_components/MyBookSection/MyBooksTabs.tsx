import ButtonComponent from '@/components/common/ui/ButtonComponent';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';
import { MyBooksTabType } from '@/types/useMypageUrlState.type';

const MyBooksTabs = ({ tab, onChange }: { tab: MyBooksTabType; onChange: (tab: MyBooksTabType) => void }) => {
  const { setMypageUrl } = useMypageUrlState();
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
          <ButtonComponent
            key={t.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              if (tab !== t.value) {
                onChange(t.value);
                setMypageUrl({ tab: t.value, page: 1 });
              }
            }}
            variant={isActive ? 'primary' : 'secondary'}
          >
            {t.label}
          </ButtonComponent>
        );
      })}
    </div>
  );
};

export default MyBooksTabs;
