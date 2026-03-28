'use client';

import useCountdown from '@/hooks/useCountdown';
import React, { useEffect } from 'react';

type PendingEmailCountDownType = {
  email: string | undefined;
  expireAt: number | null;
  onExpiredChange: (expired: boolean) => void;
};

const PendingEmailCountdown = ({ email, expireAt, onExpiredChange }: PendingEmailCountDownType) => {
  const { countDownText, isExpired } = useCountdown(expireAt, {
    enabled: !!email,
    stopOnExpire: true,
  });
  useEffect(() => {
    onExpiredChange?.(isExpired);
  }, [isExpired, onExpiredChange]);

  if (!email) return null;

  return (
    <div className="mt-1 flex items-center gap-2 text-[10px] text-default-500 flex-nowrap">
      <span>
        인증 대기중: <span className="font-semibold">{email}</span>
      </span>

      <span className="ml-2 inline-block min-w-[72px] text-red-500 tabular-nums">
        {!isExpired ? `(${countDownText} 남음)` : '인증 시간 만료'}
      </span>
    </div>
  );
};

export default React.memo(PendingEmailCountdown);
