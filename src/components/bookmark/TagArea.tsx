import { useEffect, useRef, useState } from 'react';
import { colorClass, Tag } from './BookmarkTagPicker';
import { HiHashtag } from 'react-icons/hi';
import { BookmarkMemoScope } from '@/hooks/url/useBookmarkMemoUrlState';
import ButtonComponent from '../common/ui/ButtonComponent';
import { FiPlus } from 'react-icons/fi';

const TagArea = ({ tagNames, onMore, scope }: { tagNames: Tag[]; onMore?: () => void; scope: BookmarkMemoScope }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const isDetail = scope === 'detail';

  const shouldClamp = !isDetail;
  useEffect(() => {
    if (!shouldClamp) {
      setIsOverflow(false);
      return;
    }
    const el = wrapRef.current;
    if (!el) return;
    const check = () => {
      setIsOverflow(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tagNames, shouldClamp]);

  if (tagNames.length === 0) return null;
  return (
    <div className="mt-2 px-2">
      <div ref={wrapRef} className={shouldClamp ? 'p-1 max-h-8 overflow-hidden' : ''}>
        <div className="flex flex-wrap gap-1.5">
          {tagNames.map((tag) => (
            <span
              key={tag.id ?? tag.name}
              className={`inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-[11px] text-gray-700 ring-1 ring-gray-200 cursor-default ${colorClass(tag.color)}`}
            >
              <HiHashtag className="h-3 w-3" />
              <p className="text-[11px] font-semibold text-gray-700">{tag.name}</p>
            </span>
          ))}
        </div>
      </div>

      {!isDetail && isOverflow && onMore && (
        <ButtonComponent type="button" onClick={onMore} size="xs" variant="ghost" className="text-[10px] text-gray-500">
          <div className="flex">
            <FiPlus className="h-3 w-3 " />
            <p>더보기</p>
          </div>
        </ButtonComponent>
      )}
    </div>
  );
};

export default TagArea;
