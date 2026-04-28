'use client';
import { FiX } from 'react-icons/fi';
import ButtonComponent from '../common/ui/ButtonComponent';
import { COLOR_TOKENS } from './BookmarkTagPicker';
import { useEffect, useRef } from 'react';
import { HiHashtag } from 'react-icons/hi';

type TagColorPopoverProps = {
  open: boolean;
  onClose: () => void;
  value: string | null;
  onSelect: (next: string | null) => void;
  tagName?: string;
  className?: string;
};
const TagColorPopover = ({ open, onClose, value, onSelect, tagName, className }: TagColorPopoverProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label={tagName ? `${tagName} 색상 선택` : '태그 색상 선택'}
      className={['fixed inset-0 z-50 bg-black/50 touch-none', className ?? ''].join(' ')}
      onPointerDown={() => onClose()}
    >
      <div
        ref={panelRef}
        onPointerDown={(e) => e.stopPropagation()}
        className={`
          bg-white shadow-lg ring-1 ring-black/5
          w-full h-1/2 sm:w-[260px] sm:h-auto sm:max-h-none
          p-3
          fixed sm:absolute
          left-0 right-0 bottom-0
          sm:left-1/2 sm:top-1/2 sm:bottom-auto
          sm:-translate-x-1/2 sm:-translate-y-1/2
          rounded-t-2xl sm:rounded-2xl
        `}
      >
        <div className="flex items-center justify-between px-1 pb-2">
          <div className="flex gap-1">
            <div className="flex items-center">
              <HiHashtag className="h-3 w-3" />
              <p className="text-[11px] font-semibold text-gray-700">{tagName}</p>
            </div>
            <p className="text-[11px] font-semibold text-gray-700"> 색상</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
            aria-label="닫기"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 px-1 pb-2 ">
          {COLOR_TOKENS.map((color, index) => {
            const active = value === color.key;
            return (
              <div key={color.key + index} onClick={(e) => e.stopPropagation()}>
                <ButtonComponent
                  type="button"
                  onClick={() => {
                    onSelect(color.key);
                    onClose();
                  }}
                  size="sm"
                  aria-label={`${tagName} 색상 ${color.key}`}
                  fullWidth
                  // className={`h-6 w-6 rounded-full transition-all duration-100 ease-in-out ${color.className}`}
                  className={[
                    'h-7 w-7 rounded-full ring-0.5 transition',
                    color.className,
                    active ? 'outline outline-2 outline-[#af5858]/70' : 'hover:scale-[1.02]',
                  ].join(' ')}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TagColorPopover;
