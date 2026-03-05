'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailConfirmedPage() {
  const router = useRouter();

  useEffect(() => {
    const bc = new BroadcastChannel('bookin-auth');
    bc.postMessage({ type: 'INVALIDATE_USERINFO' });
    bc.close();

    const t = setTimeout(() => {
      router.replace('/mypage');
    }, 900); //안내 메세지 깜빡하고 페이지넘김 방지용 0.9초로 설정

    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-default-200 bg-white shadow-sm p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <span className="text-green-600 text-lg">✓</span>
          </div>

          <div className="min-w-0">
            <h1 className="text-base font-bold">이메일 확인이 완료됐어요</h1>
            <p className="text-xs text-default-500 mt-1">계정 정보를 최신 상태로 반영하는 중입니다. 잠시만요…</p>
          </div>
        </div>

        {/* 로딩 바/스피너 */}
        <div className="mt-5 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-default-200 border-t-default-600 animate-spin" />
          <p className="text-xs text-default-500">마이페이지로 이동 중</p>
        </div>

        <div className="mt-5 rounded-xl bg-default-50 p-3">
          <p className="text-[11px] text-default-600 leading-relaxed">
            이동 후에도 이메일이 바로 반영되지 않으면, 새로고침(F5) 한 번만 해주세요.
          </p>
        </div>
      </div>
    </main>
  );
}
