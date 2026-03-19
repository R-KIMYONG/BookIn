'use client';

import useCountdown from '@/hooks/useCountdown';
import TempSessionBadge, { TEMP_SESSION_SOON_TOAST_ID } from './TempSessionBadge';
import TempSessionModal from '../../modal/TempSessionModal';
import { TempSessionState } from '@/types/useCountDownOptions.type';
import { startTransition, useEffect, useState } from 'react';
import { logoutExpiredSession, resetTempSession } from '@/app/actions/auth.actions';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type TempSessionControllerProps = {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
};

const TempSessionController = ({ isLoggedIn, tempSessionExpiresAt }: TempSessionControllerProps) => {
  const [dismissedSoon, setDismissedSoon] = useState<boolean>(false);
  const [dismissedExpired, setDismissedExpired] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const isTempSession = isLoggedIn && tempSessionExpiresAt !== null;

  const { remainingSec, countDownText, isExpired } = useCountdown(tempSessionExpiresAt, {
    enabled: isTempSession,
    stopOnExpire: true,
  });

  const isSoon = remainingSec !== null && remainingSec > 0 && remainingSec <= 60;

  const isModalOpen = (isExpired && !dismissedExpired) || (isSoon && !dismissedSoon);

  useEffect(() => {
    if (remainingSec === null) return;
    if (remainingSec > 60) setDismissedSoon(false);
    if (remainingSec > 0) setDismissedExpired(false);
  }, [remainingSec]);

  useEffect(() => {
    if (!isExpired) return;

    startTransition(async () => {
      await logoutExpiredSession(pathname);
    });
  }, [isExpired, pathname]);

  useEffect(() => {
    if (isModalOpen) {
      toast.dismiss(TEMP_SESSION_SOON_TOAST_ID);
    }
  }, [isModalOpen]);

  if (!isTempSession || remainingSec === null) return null;
  const state: TempSessionState = { remainingSec, countDownText, isExpired };

  const onExtend = () => {
    startTransition(async () => {
      toast.dismiss(TEMP_SESSION_SOON_TOAST_ID);
      await resetTempSession();
      router.refresh();
      setDismissedSoon(false);
      setDismissedExpired(false);
    });
  };

  const onGoLogin = () => {
    setDismissedExpired(true);
    router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
  };

  const onClose = () => {
    if (isExpired) {
      onGoLogin();
      return;
    }

    setDismissedSoon(true);
  };

  return (
    <>
      <TempSessionBadge {...state} />

      {isModalOpen ? (
        <TempSessionModal
          {...state}
          isOpen={isModalOpen}
          remainingSec={remainingSec}
          countDownText={countDownText}
          isExpired={isExpired}
          onClose={onClose}
          onExtend={onExtend}
          onGoLogin={onGoLogin}
        />
      ) : null}
    </>
  );
};

export default TempSessionController;
