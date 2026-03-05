'use client';

import ButtonComponent from '@/components/common/ButtonComponent';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[DetailPage Error]', error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <div className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 ring-1 ring-red-200">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 9v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-red-600"
                />
                <path
                  d="M12 17h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-red-600"
                />
                <path
                  d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  className="text-red-700"
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-extrabold text-gray-900 sm:text-xl">디테일 페이지를 불러오지 못했어요</h1>
              <p className="mt-1 text-sm text-gray-600">
                일시적인 오류이거나, 도서 정보가 제공되지 않는 항목일 수 있어요.
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
            <p className="text-xs font-semibold text-gray-700">오류 정보</p>
            <p className="mt-1 break-words text-xs text-gray-600">{error?.message ?? 'Unknown error'}</p>
            {error?.digest ? <p className="mt-2 text-[11px] text-gray-400">Digest: {error.digest}</p> : null}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonComponent type="button" variant="primary" label="다시 시도" onClick={() => reset()} size="md" />

            <ButtonComponent type="button" variant="secondary" size="md">
              <Link href="/">홈으로</Link>
            </ButtonComponent>

            <ButtonComponent
              type="button"
              variant="secondary"
              label="이전 페이지"
              onClick={() => history.back()}
              size="md"
            />
          </div>
          <p className="mt-6 text-[11px] text-gray-400">
            계속 발생한다면 새로고침 후 다시 시도하거나, 다른 책으로 이동해보세요.
          </p>
        </div>
      </div>
    </div>
  );
}
