import { useEffect, useRef, useState } from 'react';
import { colorClass, Tag } from './BookmarkTagPicker';
import { HiHashtag } from 'react-icons/hi';
import Button from '../common/ui/Button';
import { FiPlus } from 'react-icons/fi';
import { BookmarkMemoScope } from '@/shared/domain/bookmark/types';

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
    <div className="relative ">
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
        <Button
          type="button"
          onClick={onMore}
          size="xs"
          variant="ghost"
          className="absolute -bottom-0 lg:-bottom-7 left-0 text-[10px] text-gray-500 hover:!bg-gray-50"
          leftIcon={<FiPlus className="h-3 w-3 " />}
          label="더보기"
        />
      )}
    </div>
  );
};

export default TagArea;
