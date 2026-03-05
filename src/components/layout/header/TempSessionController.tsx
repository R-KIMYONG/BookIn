'use client';

import useCountdown from '@/hooks/useCountdown';
import TempSessionBadge from './TempSessionBadge';
import TempSessionModal from './TempSessionModal';
import { TempSessionState } from '@/types/useCountDownOptions.type';
import { startTransition, useEffect, useState } from 'react';
import { resetTempSession } from '@/app/actions/auth.actions';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
};

export default function TempSessionController({ isLoggedIn, tempSessionExpiresAt }: Props) {
  const [dismissedSoon, setDismissedSoon] = useState<boolean>(false);
  const [dismissedExpired, setDismissedExpired] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const isTempSession = isLoggedIn && tempSessionExpiresAt !== null;

  const { remainingSec, countDownText, isExpired } = useCountdown(tempSessionExpiresAt, {
    enabled: isTempSession,
    stopOnExpire: true,
  });
  useEffect(() => {
    if (remainingSec === null) return;
    if (remainingSec > 60) setDismissedSoon(false);
    if (remainingSec > 0) setDismissedExpired(false);
  }, [remainingSec]);

  if (!isTempSession || remainingSec === null) return null;

  const isSoon = remainingSec > 0 && remainingSec <= 60;

  const isModalOpen = (isExpired && !dismissedExpired) || (isSoon && !dismissedSoon);
  const state: TempSessionState = { remainingSec, countDownText, isExpired };

  const onExtend = () => {
    startTransition(async () => {
      await resetTempSession();
      router.refresh();
      setDismissedSoon(false);
      setDismissedExpired(false);
    });
  };

  const onGoLogin = () => {
    setDismissedExpired(true);
    router.push(`/login?reason=expired&redirectTo=${encodeURIComponent(pathname)}`);
  };

  const onClose = () => {
    if (isExpired) setDismissedExpired(true);
    else setDismissedSoon(true);
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
}
