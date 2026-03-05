'use client';

import React, { useState } from 'react';
import cn from '@/utils/cn';
import ButtonComponent from './ButtonComponent';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { toast } from 'react-toastify';
import { AppPaginationProps } from '@/types/apppagenation.type';

const clamp = (page: number, min: number, totalPages: number) => Math.min(totalPages, Math.max(min, page)); //1이상  총수 이하만 허용

function range(start: number, end: number) {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

const AppPagination = ({ page, totalPages, onChange, disabled }: AppPaginationProps) => {
  //page=현재페이지를 나타남, totalPages=총페이지를 나타남, onChange=몇번페이지로 가라, disabled=비활성화 여부
  const [error, setError] = useState<boolean>(false);
  const safePage = clamp(page, 1, totalPages);
  const blockStart = Math.max(1, Math.min(safePage - 2, totalPages - 4)); //시작점 계산
  const blockEnd = Math.min(totalPages, blockStart + 4); //끝점 계산
  const pages = range(blockStart, blockEnd);

  const go = (next: number) => {
    //현재 뷰에 있는 페이지중 원하는 페이지로 이동
    if (disabled) return;
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
            <ButtonComponent variant="secondary" size="sm" onClick={prev10} disabled={disabled || !canPrev}>
              <MdKeyboardDoubleArrowLeft />
            </ButtonComponent>
            <ButtonComponent variant="secondary" size="sm" onClick={prev} disabled={disabled || !canPrev}>
              <MdChevronLeft />
            </ButtonComponent>
          </div>
          <div className="flex flex-nowrap">
            <div className="inline-flex gap-1 px-1">
              {pages.map((pageNum) => (
                <ButtonComponent
                  key={pageNum}
                  variant="ghost"
                  className={cn(
                    'h-9 w-9 shrink-0 !rounded-md !text-sm !px-2',
                    pageNum === safePage
                      ? '!bg-black !text-white !shadow-sm'
                      : '!bg-white !hover:bg-gray-100 !active:scale-[0.98]'
                  )}
                  onClick={() => go(pageNum)}
                  disabled={disabled}
                >
                  {pageNum}
                </ButtonComponent>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <ButtonComponent variant="secondary" size="sm" onClick={next} disabled={disabled || !canNext}>
              <MdChevronRight />
            </ButtonComponent>
            <ButtonComponent variant="secondary" size="sm" onClick={next10} disabled={disabled || !canNext}>
              <MdKeyboardDoubleArrowRight />
            </ButtonComponent>
          </div>
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const pageInputValue = formData.get('pageInput');
            if (!pageInputValue) return;

            const pageNumber = Number(pageInputValue);
            if (pageNumber < 1 || pageNumber > totalPages) {
              setError(true);
              toast.error(`1 ~ ${totalPages} 사이의 페이지를 입력하세요`);
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
              // pattern="[0-9]*"
              autoComplete="off"
              placeholder="예: 12"
              className={cn(
                'w-16 bg-transparent text-sm font-semibold outline-none text-center',
                error && 'border-red-400 text-red-500'
              )}
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/\D/g, '');
                e.target.value = onlyNumber;
              }}
            />

            <span className="text-xs text-gray-400">/ {totalPages}</span>
          </div>

          <ButtonComponent type="submit" label="이동" variant="secondary" />
        </form>
      </div>
    </>
  );
};

export default AppPagination;
