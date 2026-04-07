'use client';

import TempSessionBadge from './TempSessionBadge';
import { TempSessionState } from '@/types/useCountDownOptions.type';

import { useTempSessionManager } from '@/hooks/useTempSessionManager';

type TempSessionControllerProps = {
  isLoggedIn: boolean;
  tempSessionExpiresAt: number | null;
};

const TempSessionController = ({ isLoggedIn, tempSessionExpiresAt }: TempSessionControllerProps) => {
  const { isTempSession, remainingSec, countDownText, isExpired } = useTempSessionManager({
    isLoggedIn,
    tempSessionExpiresAt,
  });

  if (!isTempSession || remainingSec === null) return null;

  const state: TempSessionState = {
    remainingSec,
    countDownText,
    isExpired,
  };

  return <TempSessionBadge {...state} />;
};

export default TempSessionController;
