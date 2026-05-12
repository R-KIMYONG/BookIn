'use client';

import { TempSessionState } from '@/shared/domain/session/types';
import { useTempSessionManager } from '@/hooks/auth/useTempSessionManager';
import TempSessionBadge from './TempSessionBadge';

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
