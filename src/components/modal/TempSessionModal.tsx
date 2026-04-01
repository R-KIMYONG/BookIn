'use client';

import ButtonComponent from '@/components/common/ui/ButtonComponent';
import { TempSessionModalProps } from '@/types/useCountDownOptions.type';

const TempSessionModal = ({
  isOpen,
  remainingSec,
  countDownText,
  isExpired,
  onClose,
  onExtend,
  onGoLogin,
  showGoLoginButton,
}: TempSessionModalProps) => {
  const isReallyExpired = isExpired || remainingSec <= 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal */}
      <div
        className="relative z-10 w-full max-w-sm rounded-xl bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <h2 className="text-lg font-semibold mb-3">
          {isReallyExpired ? '로그인이 만료되었습니다' : '로그인 연장하시겠습니까?'}
        </h2>

        {/* body */}
        <div className="space-y-2 text-sm text-gray-700">
          {isReallyExpired ? (
            <>
              <p>장시간 활동이 없어 자동 로그아웃되었습니다.</p>
              <p>계속 이용하려면 다시 로그인해주세요.</p>
            </>
          ) : (
            <>
              <p>로그인 세션이 곧 만료됩니다.</p>
              <p>계속 이용하시려면 지금 연장해주세요.</p>
              <p className="text-xs text-gray-400">연장 시 로그인 시간이 2시간으로 초기화됩니다.</p>

              {countDownText && (
                <p className="text-xs text-gray-500">
                  남은 시간: <b>{countDownText}</b>
                </p>
              )}
            </>
          )}
        </div>

        {/* footer */}
        <div className="mt-5 flex justify-end gap-2">
          {isReallyExpired ? (
            <>
              <ButtonComponent type="button" label="닫기" variant="secondary" size="sm" onClick={onClose} />

              {showGoLoginButton && (
                <ButtonComponent
                  type="button"
                  label="로그인 하러가기"
                  variant="primary"
                  size="sm"
                  onClick={onGoLogin}
                />
              )}
            </>
          ) : (
            <>
              <ButtonComponent type="button" label="나중에" variant="secondary" size="sm" onClick={onClose} />

              <ButtonComponent type="button" label="연장하기" variant="primary" size="sm" onClick={onExtend} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TempSessionModal;
