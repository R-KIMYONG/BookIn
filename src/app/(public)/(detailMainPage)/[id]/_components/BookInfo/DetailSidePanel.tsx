import { ItemId } from '@/shared/domain/book/ids';
import DetailStats from './DetailStats';
import DetailBookmarkTags from './DetailBookmarkTags';
import DetailActionBar from './DetailActionBar';

type DetailSidePanelProps = {
  itemId: ItemId;
  userId: string | null;
};

const DetailSidePanel = ({ itemId, userId }: DetailSidePanelProps) => {
  return (
    <>
      <DetailActionBar itemId={itemId} />
      <DetailStats itemId={itemId} />
      <DetailBookmarkTags itemId={itemId} userId={userId} />
    </>
  );
};

export default DetailSidePanel;
