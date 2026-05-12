'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { logoutExpiredSession, resetTempSession } from '@/app/actions/session.actions';
import { useSessionModal } from '@/stores/useSessionModal';
import useCountdown from '@/hooks/common/useCountdown';
import { TEMP_SESSION_SOON_TOAST_ID } from '@/components/layout/session/TempSessionBadge';
import { STORAGE_KEY } from '@/components/session/SessionModalContainer';
import { createClient } from '@/shared/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

type useTempSessionManagerProps = {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
};

export const useTempSessionManager = ({ isLoggedIn, tempSessionExpiresAt }: useTempSessionManagerProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isProtectedPage = pathname.startsWith('/mypage');
  const isTempSession = isLoggedIn && tempSessionExpiresAt !== null;

  const { openSoon, openExpired, close } = useSessionModal();

  const hasOpenedSoon = useRef(false);
  const hasHandledExpire = useRef(false);

  const { remainingSec, countDownText, isExpired } = useCountdown(tempSessionExpiresAt, {
    enabled: isTempSession,
    stopOnExpire: true,
  });

  // 세션 연장
  const handleExtend = useCallback(async () => {
    await resetTempSession();
    close();
    router.refresh();
  }, [close, router]);

  // 새로운 세션 시작 → 상태 초기화
  useEffect(() => {
    hasOpenedSoon.current = false;
    hasHandledExpire.current = false;
  }, [tempSessionExpiresAt]);

  // 만료 1분전
  useEffect(() => {
    if (remainingSec === null) return;

    if (remainingSec > 60 || remainingSec <= 0) return;

    if (hasOpenedSoon.current) return;

    hasOpenedSoon.current = true;
    toast.dismiss(TEMP_SESSION_SOON_TOAST_ID);

    openSoon(handleExtend);
  }, [remainingSec, openSoon, handleExtend]);

  // 만료 상태
  useEffect(() => {
    if (!isExpired || hasHandledExpire.current) return;

    hasHandledExpire.current = true;

    const handleExpire = async () => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ redirectTo: pathname }));
      openExpired(pathname);

      const supabase = createClient();
      await supabase.auth.signOut();
      queryClient.clear();
      await logoutExpiredSession({
        redirectTo: pathname,
        shouldRedirectToLogin: isProtectedPage,
      });
      router.refresh();
    };

    handleExpire();
  }, [isExpired, isProtectedPage, pathname, openExpired, router, queryClient]);

  return {
    isTempSession,
    remainingSec,
    countDownText,
    isExpired,
  };
};
