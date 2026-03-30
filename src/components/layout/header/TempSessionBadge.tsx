import { useEffect, useRef } from 'react';
import { Bounce, toast } from 'react-toastify';
import { TempSessionState } from '@/types/useCountDownOptions.type';
import ExtendButton from './ExtendButton';
type TempSessionBadgeProps = TempSessionState;
export const TEMP_SESSION_SOON_TOAST_ID = 'temp-session-soon';
const TempSessionBadge = ({ remainingSec, countDownText, isExpired }: TempSessionBadgeProps) => {
  const prevRemainingRef = useRef<number | null>(null);
  useEffect(() => {
    if (remainingSec === null || remainingSec <= 0) return;

    const prev = prevRemainingRef.current;

    if (prev !== null && prev > 300 && remainingSec <= 300) {
      if (!toast.isActive(TEMP_SESSION_SOON_TOAST_ID)) {
        toast.info('5분후 세션 만료됩니다. 원하시면 지금 연장할 수 있어요.', {
          toastId: TEMP_SESSION_SOON_TOAST_ID,
          position: 'top-right',
          autoClose: false,
          draggable: true,
          transition: Bounce,
        });
      }
    }

    prevRemainingRef.current = remainingSec;
  }, [remainingSec]);
  return (
    <>
      <span className="inline-flex items-center gap-1 text-xs text-black md:text-white/90 max-w-[110px] truncate">
        <strong className="font-semibold">{countDownText ?? '--:--:--'}</strong>
        {isExpired ? <span className="text-red-200">(만료됨)</span> : null}
        <ExtendButton />
      </span>
    </>
  );
};

export default TempSessionBadge;
