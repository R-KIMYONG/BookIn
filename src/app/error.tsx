'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ButtonComponent from '@/components/common/ButtonComponent';

type GlobalProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [copied, setCopied] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'retry' | 'home' | null>(null);
  // 운영/개발 환경에 따라 상세 에러 노출 제어
  const isDev = process.env.NODE_ENV !== 'production';

  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  const errorText = useMemo(() => {
    const lines = [
      `message: ${error?.message ?? 'unknown'}`,
      `digest: ${error?.digest ?? 'n/a'}`,
      `path: ${pathname ?? 'n/a'}`,
      `time: ${new Date().toISOString()}`,
    ];
    return lines.join('\n');
  }, [error, pathname]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setShowDetail(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] w-full bg-gradient-to-b from-white to-zinc-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-600 shadow-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
          시스템 오류가 발생했어요
        </div>

        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-600"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h1 className="text-lg font-bold text-zinc-900">잠깐 문제가 생겼습니다</h1>
              <p className="mt-1 text-sm text-zinc-600">
                네트워크 문제이거나 서버에서 일시적인 오류가 발생했을 수 있어요. 아래 버튼으로 다시 시도해 주세요.
              </p>
              {isDev && (
                <p className="mt-3 rounded-lg bg-zinc-50 px-3 py-2 text-[12px] text-zinc-700">
                  <span className="font-semibold">DEV</span> · {error?.message}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonComponent
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (loadingAction) return;
                    setLoadingAction('retry');
                    reset();
                    setTimeout(() => setLoadingAction(null), 300);
                  }}
                  isLoading={loadingAction === 'retry'}
                >
                  다시 시도
                </ButtonComponent>
                <ButtonComponent
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLoadingAction('home');
                    router.push('/');
                  }}
                  isLoading={loadingAction === 'home'}
                  loadingText="이동중..."
                >
                  홈으로
                </ButtonComponent>
                <ButtonComponent variant="ghost" size="sm" onClick={() => setShowDetail((v) => !v)}>
                  {showDetail ? '상세 닫기' : '상세 보기'}
                </ButtonComponent>
                <ButtonComponent variant="secondary" size="sm" onClick={handleCopy}>
                  {copied ? '복사됨!' : '에러 정보 복사'}
                </ButtonComponent>
              </div>

              {/* 상세 정보 */}
              {showDetail && (
                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <p className="mb-2 text-[11px] font-semibold text-zinc-700">Error details</p>
                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words text-[11px] text-zinc-700">
                    {errorText}
                  </pre>
                  <p className="mt-2 text-[11px] text-zinc-500">
                    이 내용을 복사해서 이슈로 남기면 원인 파악이 빨라져요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 안내 */}
        <p className="mt-6 text-center text-[12px] text-zinc-500">
          동일 문제가 계속되면 잠시 후 다시 시도하거나, 새로고침 후 재접속해 주세요.
        </p>
      </div>
    </div>
  );
};

export default GlobalError;
