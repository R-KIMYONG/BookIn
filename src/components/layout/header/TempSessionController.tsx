'use client';

import useCountdown from '@/hooks/useCountdown';
import TempSessionBadge, { TEMP_SESSION_SOON_TOAST_ID } from './TempSessionBadge';
import TempSessionModal from '../../modal/TempSessionModal';
import { TempSessionState } from '@/types/useCountDownOptions.type';
import { useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { logoutExpiredSession, resetTempSession } from '@/app/actions/session.actions';

type TempSessionControllerProps = {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
};

const TempSessionController = ({ isLoggedIn, tempSessionExpiresAt }: TempSessionControllerProps) => {
  //none: 아무 모달도 닫지않음  초기상태
  //soonModalClosed: 60초후 곧 만료 모달 닫음
  //expiredModalClosed: 만료됨 모달을 닫음
  const [isSoonModalClosed, setIsSoonModalClosed] = useState<boolean>(false); // false면 아직 닫지 않음
  const pathname = usePathname();
  const isProtectedPage = pathname.startsWith('/mypage');
  const router = useRouter();
  const isTempSession = isLoggedIn && tempSessionExpiresAt !== null; //로그인했고 시간이 null이 아닐때 카운트다운 시작(2시간)
  const { remainingSec, countDownText, isExpired } = useCountdown(tempSessionExpiresAt, {
    enabled: isTempSession,
    stopOnExpire: true,
  });

  //세션1분남은 모달 open
  const isSoon = remainingSec !== null && remainingSec > 0 && remainingSec <= 60;

  // 곧 만료 모달 open
  const isSoonModalOpen = isSoon && !isSoonModalClosed; //곧 만료 상태고 사용자가 곧만료 모달을 닫기전상태

  useEffect(() => {
    if (remainingSec === null) return;
    // 세션 연장 등으로 60초 초과 구간으로 돌아가면,
    // 이전에 닫았던 모달 상태를 초기화해서 다음 만료 사이클에서 다시 보여줄 수 있게 한다.
    if (remainingSec > 60 && isSoonModalClosed) {
      setIsSoonModalClosed(false);
    }
  }, [remainingSec, isSoonModalClosed]);

  useEffect(() => {
    if (!isExpired) return;

    const handleExpire = async () => {
      if (isProtectedPage) {
        await logoutExpiredSession({
          redirectTo: pathname,
          shouldRedirectToLogin: true,
        });
        return;
      }

      await logoutExpiredSession({
        redirectTo: pathname,
        shouldRedirectToLogin: false,
      });

      router.replace(`${pathname}?session=expired&redirectTo=${encodeURIComponent(pathname)}`, { scroll: false });
    };

    handleExpire();
  }, [isExpired, isProtectedPage, pathname, router]);

  useEffect(() => {
    //모달 나오면 토스트는 종료
    if (!isSoonModalOpen) return;

    toast.dismiss(TEMP_SESSION_SOON_TOAST_ID);
  }, [isSoonModalOpen]);

  if (!isTempSession || remainingSec === null) return null;
  const state: TempSessionState = { remainingSec, countDownText, isExpired };

  const onExtend = async () => {
    toast.dismiss(TEMP_SESSION_SOON_TOAST_ID);
    await resetTempSession();
    router.refresh();
    setIsSoonModalClosed(false);
  };

  const onClose = () => {
    setIsSoonModalClosed(true);
  };

  return (
    <>
      <TempSessionBadge {...state} />

      {isSoonModalOpen ? (
        <TempSessionModal
          remainingSec={remainingSec}
          countDownText={countDownText}
          isOpen={isSoonModalOpen}
          isExpired={false}
          onClose={onClose}
          onExtend={onExtend}
        />
      ) : null}
    </>
  );
};

export default TempSessionController;
