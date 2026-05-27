'use client';

import React, { useEffect, useState } from 'react';
import cn from '@/shared/utils/cn';
import Button from './ui/Button';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type AppPaginationProps = {
  page: number;
  totalPages: number;
  onChange: (next: number) => void;
  disabled?: boolean;
};

const clamp = (page: number, min: number, totalPages: number) => Math.min(totalPages, Math.max(min, page)); //1이상  총수 이하만 허용

const range = (start: number, end: number) => {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
};

const AppPagination = ({ page, totalPages, onChange, disabled }: AppPaginationProps) => {
  //page=현재페이지를 나타남, totalPages=총페이지를 나타남, onChange=몇번페이지로 가라, disabled=비활성화 여부
  const [error, setError] = useState<boolean>(false);
  const safePage = clamp(page, 1, totalPages);
  const visibleCount = 3;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      onChange(totalPages);
    }
  }, [page, totalPages, onChange]);

  const blockStart = Math.max(1, Math.min(safePage - Math.floor(visibleCount / 2), totalPages - (visibleCount - 1)));
  const blockEnd = Math.min(totalPages, blockStart + (visibleCount - 1));
  const pages = range(blockStart, blockEnd);

  const go = (next: number) => {
    //현재 뷰에 있는 페이지중 원하는 페이지로 이동
    if (disabled) return;
    const nextPage = clamp(next, 1, totalPages);
    if (nextPage === safePage) return;
    onChange(clamp(next, 1, totalPages));
  };

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  const prev = () => go(safePage - 1);
  const next = () => go(safePage + 1);
  const prev10 = () => go(safePage - 10);
  const next10 = () => go(safePage + 10);
  return (
    <>
      <div className="w-full flex flex-col items-center gap-3">
        <div className="px-4 flex items-center gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="secondary" size="sm" onClick={prev10} disabled={disabled || !canPrev}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={prev} disabled={disabled || !canPrev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-nowrap">
            <div className="inline-flex gap-1 px-1">
              {pages.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant="ghost"
                  className={cn(
                    'h-8 w-8 shrink-0 !rounded-md !text-sm !px-2',
                    pageNum === safePage
                      ? '!bg-black !text-white !shadow-sm'
                      : '!bg-white !hover:bg-gray-100 !active:scale-[0.98]'
                  )}
                  onClick={() => go(pageNum)}
                  disabled={disabled || pageNum === safePage}
                >
                  {pageNum}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="secondary" size="sm" onClick={next} disabled={disabled || !canNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={next10} disabled={disabled || !canNext}>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const pageInputValue = formData.get('pageInput');
            if (!pageInputValue) return;

            const pageNumber = Number(pageInputValue);
            if (pageNumber < 1 || pageNumber > totalPages) {
              setError(true);
              showToast(RESULT_CODE.PAGINATION_PAGE_OUT_OF_RANGE, { variables: { totalPages } });
              return;
            }
            setError(false);
            go(pageNumber);
          }}
        >
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-black/10">
            <span className="text-xs text-gray-500">페이지</span>

            <input
              name="pageInput"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="예: 12"
              className={cn(
                'w-10 bg-transparent text-sm font-semibold outline-none text-center h-4 placeholder:text-xs',
                error && 'border-red-400 text-red-500'
              )}
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/\D/g, '');
                e.target.value = onlyNumber;
              }}
            />

            <span className="text-xs text-gray-400">/ {totalPages}</span>
          </div>

          <Button type="submit" label="이동" variant="secondary" />
        </form>
      </div>
    </>
  );
};

export default AppPagination;
