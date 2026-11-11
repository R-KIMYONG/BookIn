'use client';
import Button from '@/components/common/ui/Button';
import MenuIcon from '@/components/icons/MenuIcon';
import { useCategoryTree } from '@/hooks/category/useCategoryTree';
import { CategoryNode } from '@/shared/domain/category/types';
import { getCategoryIcon } from '@/shared/domain/header/getCategoryIcon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const TABS = [
  { key: '001', label: '국내도서' },
  { key: '002', label: '외국도서' },
  { key: '017', label: 'eBook' },
];

const CategoryDrawer = () => {
  const [openSideBar, setOpenSidebar] = useState<boolean>(false);
  const [tab, setTab] = useState(TABS[0].key);
  const [selectedMid, setSelectedMid] = useState<CategoryNode | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);

  const { data: tree, isPending, isError, refetch } = useCategoryTree(openSideBar);

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

  const close = () => {
    setOpenSidebar(false);
    setSelectedMid(null);
  };

  const selectedMall = tree?.find((node) => node.id === tab);
  const rowClass = 'block w-full rounded px-2 py-2 text-left text-xs text-gray-700 hover:bg-gray-50';

  return (
    <>
      <MenuIcon onClick={() => setOpenSidebar(true)} />
      {openSideBar &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50">
            {/* 배경(딤) — 클릭 시 닫기 */}
            <div className="absolute inset-0 bg-black/40" onClick={close} />

            {/* 좌측 패널 */}
            <aside className="absolute left-0 top-0 h-full w-[340px] max-w-[90vw] overflow-hidden bg-white">
              <div
                className={`flex h-full w-[200%] transition-transform duration-300 ${
                  selectedMid ? '-translate-x-1/2' : 'translate-x-0'
                }`}
              >
                {/* 첫 화면: 대분류 탭 + 중분류 */}
                <div inert={!!selectedMid} className="flex h-full w-1/2 flex-col p-4">
                  <div className="flex w-full gap-1 border-b border-gray-100">
                    {TABS.map((t) => (
                      <div className="flex flex-1 flex-col items-center py-2" key={t.key}>
                        <button type="button" onClick={() => setTab(t.key)} className="text-sm">
                          {t.label}
                        </button>
                        <div
                          className={`mt-2 h-0.5 rounded-full bg-main transition-all duration-300 ease-in-out ${
                            tab === t.key ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {isPending ? (
                    <p className="mt-6 text-center text-sm text-gray-500">불러오는 중...</p>
                  ) : isError ? (
                    <div className="mt-6 text-center text-sm text-gray-600">
                      <p>카테고리를 불러오지 못했어요</p>
                      <Button variant="ghost" label="다시 시도" className="mt-2" onClick={() => refetch()} />
                    </div>
                  ) : (
                    <>
                      <Link href={`/category/${tab}`} onClick={close} className={`${rowClass} mt-2 font-semibold`}>
                        {selectedMall?.name} 전체 보기
                      </Link>

                      <ul className="grid min-h-0 grid-cols-2 gap-1 overflow-y-auto">
                        {selectedMall?.children.map((mid) => {
                          const CategoryIcon = getCategoryIcon(mid.name);
                          const content = (
                            <div className="flex items-center gap-1">
                              <CategoryIcon size={15} className="shrink-0" />
                              <p className="min-w-0 flex-1 truncate" title={mid.name}>
                                {mid.name}
                              </p>
                            </div>
                          );

                          return (
                            <li key={mid.id} className="min-w-0">
                              {mid.children.length > 0 ? (
                                <button type="button" onClick={() => setSelectedMid(mid)} className={rowClass}>
                                  {content}
                                </button>
                              ) : (
                                <Link href={`/category/${mid.id}`} onClick={close} className={rowClass}>
                                  {content}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>

                {/* 둘째 화면: 소분류 */}
                <div inert={!selectedMid} className="flex h-full w-1/2 flex-col p-4">
                  <Button
                    variant="secondary"
                    label="뒤로가기"
                    size="sm"
                    className="self-start"
                    onClick={() => setSelectedMid(null)}
                  />

                  {selectedMid && (
                    <>
                      <Link
                        href={`/category/${selectedMid.id}`}
                        onClick={close}
                        className={`${rowClass} mt-2 font-semibold`}
                      >
                        {selectedMid.name} 전체 보기
                      </Link>

                      <ul className="min-h-0 overflow-y-auto">
                        {selectedMid.children.map((small) => {
                          const CategoryIcon = getCategoryIcon(small.name);
                          return (
                            <li key={small.id} className="flex items-center">
                              <CategoryIcon size={15} className="shrink-0" />
                              <Link href={`/category/${small.id}`} onClick={close} className={rowClass}>
                                {small.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
};

export default CategoryDrawer;
