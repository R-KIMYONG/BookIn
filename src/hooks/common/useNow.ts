'use client';

import { useEffect, useState } from 'react';

type UseNowOptions = {
  enabled?: boolean;
  interval?: number;
  stopAt?: number | null;
};

const useNow = ({ interval = 1000, enabled = true, stopAt }: UseNowOptions) => {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const update = () => {
      const currentTime = Date.now();

      setNow(currentTime);
    };

    update();

    const timer = setInterval(() => {
      const currentTime = Date.now();

      setNow(currentTime);

      if (stopAt && currentTime >= stopAt) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval, enabled, stopAt]);

  return now;
};

export default useNow;
