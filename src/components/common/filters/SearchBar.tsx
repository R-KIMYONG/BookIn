'use client';
import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import { SearchQueryType } from '@/shared/domain/search/types';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { Search, X } from 'lucide-react';
import {
  DEFAULT_SEARCH_QT,
  RANGE,
  SEARCH_QT_LIST,
  SEARCH_QUERYTYPE_OPTION,
  SEARCH_TYPE_LABEL,
} from '@/shared/domain/search/constants';
import { DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';
import { HEADER_GROUPS } from '@/shared/domain/header/constants';
import { useSearchNavigate } from '@/hooks/search/useSearchNavigate';

const SearchBar = ({ genres }: { genres: typeof HEADER_GROUPS }) => {
  const { setSearchUrl } = useSearchNavigate();
  const [keyword, setKeyword] = useState<string>('');
  const [sq, setSq] = useState<SearchQueryType>(DEFAULT_SEARCH_QT);
  const [target, setTarget] = useState<TargetTypes>(DEFAULT_TARGET);
  const [ci, setCi] = useState<number>(0);

  const [openPanel, setOpenPanel] = useState<boolean>(false);

  const wrapRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setKeyword('');
    setCi(0);
    setSq(DEFAULT_SEARCH_QT);
    setTarget(DEFAULT_TARGET);
  };

  const gen = target ? (genres.find((g) => g.key === target)?.items ?? []) : [];

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
    setSearchUrl({ keyword, sq, target, ci });
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
            maxLength={20}
            placeholder={SEARCH_QUERYTYPE_OPTION[sq]}
            onFocus={() => setOpenPanel(true)}
            onClick={() => setOpenPanel(true)}
            onChange={(e) => setKeyword(e.target.value)}
            className="min-w-0 flex-1 bg-transparent pl-1 text-base placeholder-gray-400 outline-none placeholder:text-sm"
          />
        </div>

        {/* 조건 패널 */}
        {openPanel && (
          <div className="absolute left-0 top-full z-50 mt-2 w-full sm:w-[340px] space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
            <X size={15} className="absolute right-3 top-3 cursor-pointer" onClick={() => setOpenPanel(false)} />
            {/* 검색 필드 */}
            <section>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">검색 필드</p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_QT_LIST.map((sqItem) => (
                  <Button
                    key={sqItem}
                    label={SEARCH_TYPE_LABEL[sqItem]}
                    onClick={() => setSq(sqItem)}
                    variant={sq === sqItem ? 'primary' : 'ghost'}
                  />
                ))}
              </div>
            </section>

            {/* 범위 */}
            <section>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">범위</p>
              <div className="flex flex-wrap gap-2">
                {RANGE.map(({ v, label }) => (
                  <Button
                    key={label}
                    label={label}
                    type="button"
                    onClick={() => {
                      setTarget(v);
                      setCi(0);
                    }}
                    variant={target === v ? 'primary' : 'ghost'}
                  />
                ))}
              </div>
            </section>

            {/* 세부: 범위 선택 시에만 */}
            {target && (
              <section>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">세부 카테고리</p>
                <select
                  value={ci}
                  onChange={(e) => setCi(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700"
                >
                  <option value={0}>세부 선택 (전체)</option>
                  {gen.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </section>
            )}

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
