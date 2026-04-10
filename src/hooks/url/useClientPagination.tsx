'use client';

import { useEffect, useState } from 'react';

type Options = {
  paramKey?: string;
  defaultPage?: number;
};

export const useClientPagination = (options?: Options) => {
  const paramKey = options?.paramKey ?? 'page';
  const defaultPage = options?.defaultPage ?? 1;

  const [page, setPage] = useState<number>(defaultPage);

  // 초기 URL → state 동기화
  useEffect(() => {
    const url = new URL(window.location.href);
    const p = Number(url.searchParams.get(paramKey));

    if (Number.isFinite(p) && p >= 1) {
      setPage(p);
    }
  }, [paramKey]);

  // 뒤로가기 / 앞으로가기 대응
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const p = Number(url.searchParams.get(paramKey));

      setPage(Number.isFinite(p) && p >= 1 ? p : defaultPage);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [paramKey, defaultPage]);

  // 페이지 변경
  const updatePage = (nextPage: number) => {
    if (nextPage < 1) return;

    const url = new URL(window.location.href);
    url.searchParams.set(paramKey, String(nextPage));

    // 히스토리 쌓기 (뒤로가기 가능)
    window.history.pushState({ [paramKey]: nextPage }, '', url.toString());

    setPage(nextPage);
  };

  return {
    page,
    setPage: updatePage,
  };
};
