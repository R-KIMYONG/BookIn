'use client';
import MenuIcon from '@/components/icons/MenuIcon';
import { DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';
import { HEADER_GROUPS } from '@/shared/domain/header/constants';
import { getCategoryIcon } from '@/shared/domain/header/getCategoryIcon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const TABS: { key: TargetTypes; label: string }[] = [
  { key: 'Book', label: '국내도서' },
  { key: 'Foreign', label: '외국도서' },
  { key: 'eBook', label: 'eBook' },
];

const CategoryDrawer = () => {
  const [openSideBar, setOpenSidebar] = useState<boolean>(false);
  const [tab, setTab] = useState<TargetTypes>(DEFAULT_TARGET);
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!openSideBar) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [openSideBar]);

  const items = HEADER_GROUPS.find((g) => g.key === tab)?.items ?? [];

  return (
    <>
      <MenuIcon onClick={() => setOpenSidebar(true)} />
      {openSideBar &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50">
            {/* 배경(딤) — 클릭 시 닫기 */}
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpenSidebar(false)} />
            {/* 좌측 패널 */}
            <aside className="absolute left-0 top-0 h-full w-[340px] max-w-[90vw] flex flex-col bg-white p-4">
              {/* 탭 */}
              <div className="flex w-full gap-1 border-b border-gray-100">
                {TABS.map((t) => (
                  <div className="flex-1 py-2 flex flex-col items-center" key={t.key}>
                    <button
                      type="button"
                      onClick={() => setTab(t.key)}
                      className={`text-sm`}
                    >
                      {t.label}
                    </button>
                    <div className={`transition-all duration-300 ease-in-out bg-main h-0.5 rounded-full mt-2 ${tab === t.key ? 'w-full' : 'w-0'}`} />
                  </div>
                ))}
              </div>
              {/* 세부 목록 */}
              <ul className="grid grid-cols-2 gap-1 overflow-y-auto min-h-0 mt-2">
                {items.map((g) => {
                  const CategoryIcon = getCategoryIcon(g.label);
                  return (
                    <li key={g.id}>
                      <Link
                        href={`/category/${g.id}?target=${tab}`}
                        onClick={() => setOpenSidebar(false)}
                        className={`block rounded px-2 py-2 text-sm text-gray-700 hover:bg-gray-50`}
                      >
                        <div className="flex items-center gap-1">
                          <CategoryIcon size={15} />
                          <p className="whitespace-nowrap text-xs">{g.label}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
};

export default CategoryDrawer;
