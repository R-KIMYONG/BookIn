import { UseCountdownOptions } from '@/shared/domain/countdown/types';
import { useMemo } from 'react';
import useNow from './useNow';

const formatHMS = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const useCountdown = (expiresAtMs?: number | null, options: UseCountdownOptions = {}) => {
  //enabled :기본은 적용인데 파라미터가 아닐때는 아니고
  //intervalMs: 몇초마다 시간갱신할지
  //stopOnExpire 만료되면 interval 정지여부 없으면 기본은 멈춤
  const { enabled = true, intervalMs = 1000, stopOnExpire = true } = options;

  const now = useNow({ enabled, interval: intervalMs, stopAt: stopOnExpire ? expiresAtMs : null });

  const remainingSec = useMemo(() => {
    if (!enabled) return null;
    if (!expiresAtMs) return null;
    if (now === null) return null;
    const remainingMs = Math.max(0, expiresAtMs - now); //남은 밀리초를 계산 그리고 음수 나오기 방지해서 최소 0으로 설정
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
