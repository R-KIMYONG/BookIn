import { useEffect, useRef } from 'react';
import { Bounce, toast } from 'react-toastify';
import { TempSessionState } from '@/shared/domain/session/types';
import ExtendButton from '@/components/common/ui/ExtendButton';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { TEMP_SESSION_SOON_TOAST_ID } from '@/shared/domain/session/constants';
type TempSessionBadgeProps = TempSessionState;

const TempSessionBadge = ({ remainingSec, countDownText, isExpired }: TempSessionBadgeProps) => {
  const prevRemainingRef = useRef<number | null>(null);
  useEffect(() => {
    if (remainingSec === null || remainingSec <= 0) return;

    const prev = prevRemainingRef.current;

    if (prev !== null && prev > 300 && remainingSec <= 300) {
      if (!toast.isActive(TEMP_SESSION_SOON_TOAST_ID)) {
        showToast(RESULT_CODE.AUTH_SESSION_EXPIRING_SOON, {
          toastId: TEMP_SESSION_SOON_TOAST_ID,
          preventDuplicate: true,
          toastOptions: {
            autoClose: false,
            draggable: true,
            transition: Bounce,
          },
        });
      }
    }

    prevRemainingRef.current = remainingSec;
  }, [remainingSec]);
  return (
    <>
      <span className="inline-flex items-center gap-1 text-xs text-white md:text-white/90 max-w-[110px] truncate">
        <strong className="font-semibold">{countDownText ?? '--:--:--'}</strong>
        {isExpired ? <span className="text-red-200">(만료됨)</span> : null}
        <ExtendButton />
      </span>
    </>
  );
};

export default TempSessionBadge;
