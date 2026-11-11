'use client';
import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { Search, X } from 'lucide-react';
import {
  RANGE,
  SEARCH_INPUT_MAXLENGTH,
  SEARCH_PLACEHOLDER,
  SEARCH_SORT_LABEL,
  SEARCH_SORT_OPTIONS,
} from '@/shared/domain/search/constants';
import { TargetTypes } from '@/shared/constants/category';
import { useSearchNavigate } from '@/hooks/search/useSearchNavigate';
import { SEARCH_DEFAULT_SORT } from '@/shared/lib/yes24/constants';
import { SearchSort } from '@/shared/lib/yes24/types';
import { toast } from 'react-toastify';

const SearchBar = () => {
  const { setSearchUrl } = useSearchNavigate();
  const [keyword, setKeyword] = useState<string>('');
  const [sort, setSort] = useState<SearchSort>(SEARCH_DEFAULT_SORT);
  const [target, setTarget] = useState<TargetTypes | undefined>(undefined); // undefined = 전체

  const [openPanel, setOpenPanel] = useState<boolean>(false);

  const wrapRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setKeyword('');
    setSort(SEARCH_DEFAULT_SORT);
    setTarget(undefined);
  };

  useEffect(() => {
    if (!openPanel) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpenPanel(false);
    };
    const onScroll = () => setOpenPanel(false);
    const setScrollEventTimer = setTimeout(() => {
      window.addEventListener('scroll', onScroll, { passive: true });
    }, 100);

    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);

    return () => {
      clearTimeout(setScrollEventTimer);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [openPanel]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) {
      showToast(RESULT_CODE.VALIDATION_REQUIRED_SEARCHKEYWORD);
      return;
    }
    setSearchUrl({ keyword, target, sort });
    setOpenPanel(false);
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <form onSubmit={handleSubmit} action="/search" method="get">
        {/* 바 */}
        <div className="flex h-7 w-full items-center gap-1 rounded-2xl border border-gray-200 bg-white px-2">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="search"
            name="q"
            autoComplete="off"
            value={keyword}
            maxLength={SEARCH_INPUT_MAXLENGTH}
            placeholder={SEARCH_PLACEHOLDER}
            onFocus={() => setOpenPanel(true)}
            onClick={() => setOpenPanel(true)}
            onChange={(e) => {
              const next = e.target.value;
              setKeyword(next);
              if (next.length === SEARCH_INPUT_MAXLENGTH) {
                toast.warn('최대 20자까지 입력가능합니다.', { toastId: 'search-input-maxlength', autoClose: false });
              }
            }}
            className="min-w-0 flex-1 bg-transparent pl-1 text-base placeholder-gray-400 outline-none placeholder:text-sm"
          />
        </div>

        {/* 조건 패널 */}
        {openPanel && (
          <div className="absolute left-0 top-full z-50 mt-2 w-full sm:w-[340px] space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
            <X size={15} className="absolute right-3 top-3 cursor-pointer" onClick={() => setOpenPanel(false)} />

            {/* 범위 */}
            <section>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">범위</p>
              <div className="flex flex-wrap gap-2">
                {RANGE.map(({ v, label }) => (
                  <Button
                    key={label}
                    label={label}
                    type="button"
                    onClick={() => setTarget(v)}
                    variant={target === v ? 'primary' : 'ghost'}
                  />
                ))}
              </div>
            </section>

            {/* 정렬 */}
            <section>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">정렬</p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SORT_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    label={SEARCH_SORT_LABEL[option]}
                    type="button"
                    onClick={() => setSort(option)}
                    variant={sort === option ? 'primary' : 'ghost'}
                  />
                ))}
              </div>
            </section>

            {/* 푸터: 초기화 / 검색 */}
            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
              <Button type="button" variant="secondary" size="xs" onClick={handleReset} label="초기화" />
              <Button type="submit" variant="primary" size="xs" label="검색" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
