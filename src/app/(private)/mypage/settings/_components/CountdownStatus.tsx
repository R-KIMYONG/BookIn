'use client';

import useCountdown from '@/hooks/common/useCountdown';
import React, { useEffect } from 'react';

type CountdownStatusProps = {
  expireAt: number | null;

  //상단 표시 텍스트 (ex: "인증 대기중: test@email.com")
  label?: string;

  //만료 시 표시 텍스트
  expiredText?: string;

  // countdown 표시 여부
  showTime?: boolean;

  //만료 상태 콜백
  onExpiredChange?: (expired: boolean) => void;

  //활성 여부 (기본: expireAt 존재 여부)
  enabled?: boolean;

  className?: string;
};

const CountdownStatus = ({
  expireAt,
  label,
  expiredText = '시간 만료',
  showTime = true,
  enabled,
  className,
  onExpiredChange,
}: CountdownStatusProps) => {
  const { countDownText, isExpired } = useCountdown(expireAt, {
    enabled: enabled ?? !!expireAt,
    stopOnExpire: true,
  });
  useEffect(() => {
    onExpiredChange?.(isExpired);
  }, [isExpired, onExpiredChange]);

  if (!expireAt) return null;

  return (
    <div className={`mt-1 flex items-center gap-2 text-[10px] text-default-500 ${className ?? ''}`}>
      {label && <span>{label}</span>}

      {showTime && (
        <span className="ml-2 inline-block min-w-[72px] text-red-500 tabular-nums">
          {!isExpired ? `(${countDownText} 남음)` : expiredText}
        </span>
      )}
    </div>
  );
};

export default React.memo(CountdownStatus);
