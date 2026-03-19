import { useEffect, useRef } from 'react';
import { Bounce, toast } from 'react-toastify';
import { TempSessionState } from '@/types/useCountDownOptions.type';
import ExtendButton from './ExtendButton';
type TempSessionBadgeProps = TempSessionState;
export const TEMP_SESSION_SOON_TOAST_ID = 'temp-session-soon';
const TempSessionBadge = ({ remainingSec, countDownText, isExpired,  }: TempSessionBadgeProps) => {
  const prevRemainingRef = useRef<number | null>(null);
  useEffect(() => {
    if (remainingSec === null || remainingSec <= 0) return;

    const prev = prevRemainingRef.current;

    if (prev !== null && prev > 300 && remainingSec <= 300) {
      if (!toast.isActive(TEMP_SESSION_SOON_TOAST_ID)) {
        toast.info('로그인 시간이 곧 만료됩니다. 원하시면 지금 연장할 수 있어요.', {
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
      <div className="text-xs text-white/90 flex items-center gap-2" suppressHydrationWarning>
        <b>{countDownText ?? '--:--:--'}</b>
        {isExpired ? <span className="ml-2 text-red-200">(만료됨)</span> : null}
        <ExtendButton />
      </div>
    </>
  );
};

export default TempSessionBadge;
