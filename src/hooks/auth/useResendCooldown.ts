'use client';

import { useEffect, useMemo, useState } from 'react';

type UseResendCooldownOptions = {
  requestTime: number | null;
  cooldownMs: number;
};

const useResendCooldown = ({ requestTime, cooldownMs }: UseResendCooldownOptions) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!requestTime) return;

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [requestTime]);

  const remainMs = useMemo(() => {
    if (!requestTime) return 0;

    return Math.max(0, cooldownMs - (now - requestTime));
  }, [requestTime, cooldownMs, now]);

  const remainSec = Math.ceil(remainMs / 1000);

  const canRetry = remainMs === 0;

  return {
    remainSec,
    canRetry,
  };
};

export default useResendCooldown;
