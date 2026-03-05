import { UseCountdownOptions } from '@/types/useCountDownOptions.type';
import { useEffect, useMemo, useState } from 'react';

function formatHMS(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const useCountdown = (expiresAtMs?: number | null, options: UseCountdownOptions = {}) => {
  const [now, setNow] = useState<number | null>(null);

  const { enabled = true, intervalMs = 1000, stopOnExpire = true } = options;

  useEffect(() => {
    if (!enabled) return;
    if (!expiresAtMs) return;

    // 1초마다 현재시간 갱신
    setNow(Date.now());

    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);

      if (stopOnExpire && t >= expiresAtMs) {
        window.clearInterval(id);
      }
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [enabled, expiresAtMs, intervalMs, stopOnExpire]);

  const remainingSec = useMemo(() => {
    if (!enabled) return null;
    if (!expiresAtMs) return null;
    if (now === null) return null;
    const remainingMs = Math.max(0, expiresAtMs - now);
    return Math.floor(remainingMs / 1000);
  }, [expiresAtMs, now, enabled]);

  const countDownText = useMemo(() => {
    if (remainingSec === null) return null;
    return formatHMS(remainingSec);
  }, [remainingSec]);

  const isExpired = remainingSec !== null && remainingSec <= 0;

  return { remainingSec, countDownText, isExpired };
};

export default useCountdown;
