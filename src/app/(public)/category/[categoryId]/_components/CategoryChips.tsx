'use client';
import Link from 'next/link';
import React, { useLayoutEffect, useRef, useState } from 'react';

const chipClass = (active: boolean) =>
  `shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors ${
    active ? 'border-main bg-main text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
  }`;

type ChipOption = { id: string; name: string };

type CategoryChipsProps = {
  chips: ChipOption[];
  allId?: string; // "전체" 칩의 이동 대상 (중분류 id). 대분류 페이지엔 없음
  activeId?: string; // 선택된 칩의 id
};

const CategoryChips = ({ chips, allId, activeId }: CategoryChipsProps) => {
  const navRef = useRef<HTMLElement>(null);
  const [pendingId, setPendingId] = useState<string | null>(null); // 누른 칩 (이동 전 즉시 강조)
  const currentId = pendingId ?? activeId;

  const scrollToChip = (chip: HTMLElement, behavior: ScrollBehavior) => {
    const nav = navRef.current;
    if (!nav) return;
    const left = chip.offsetLeft - nav.offsetLeft - (nav.clientWidth - chip.offsetWidth) / 2;
    nav.scrollTo({ left, behavior });
  };
  useLayoutEffect(() => {
    const active = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (active) scrollToChip(active, 'instant');
  }, [activeId]);

  const handleSelect = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.metaKey || e.ctrlKey) return; // 새 탭으로 열 때는 제외
    setPendingId(id);
    scrollToChip(e.currentTarget, 'smooth');
  };
  return (
    <nav
      ref={navRef}
      aria-label="하위 카테고리"
      className="mt-2 flex gap-2 overflow-x-auto pr-8 [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)]"
    >
      {allId && (
        <Link
          href={`/category/${allId}`}
          aria-current={currentId === allId ? 'page' : undefined}
          className={chipClass(currentId === allId)}
        >
          전체
        </Link>
      )}
      {chips.map((chip) => {
        const active = chip.id === currentId;
        return (
          <Link
            key={chip.id}
            href={`/category/${chip.id}`}
            onClick={(e) => handleSelect(e, chip.id)}
            aria-current={active ? 'page' : undefined}
            className={chipClass(active)}
          >
            {chip.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default CategoryChips;
