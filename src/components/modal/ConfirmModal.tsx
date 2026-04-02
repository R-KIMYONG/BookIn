import { useEffect } from 'react';
import ButtonComponent from '../common/ui/ButtonComponent';

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onClose: () => void;
  confirmColor?: 'primary' | 'danger' | 'default';
  isLoading?: boolean;
  formAction?: (formData: FormData) => void | Promise<void>;
};
const ConfirmModal = ({
  isOpen,
  title = '확인',
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onClose,
  confirmColor = 'primary',
  isLoading = false,
  formAction,
}: ConfirmModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    // 스크롤바 너비 계산
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // padding 보정
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 백그라운드 클릭 시  */}
      <div className="absolute inset-0 bg-black/50" onClick={!isLoading ? onClose : undefined} />

      {/* modal */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
        {/* 모달 헤더부분 */}
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        {/* 모달 내용 */}
        <p className="text-sm text-gray-700 whitespace-pre-line mb-4">{message}</p>

        {/* 모달 푸터 -> 제어 버튼 있어햐함 */}
        <div className="flex justify-end gap-2">
          <ButtonComponent type="button" label={cancelLabel} variant="secondary" size="sm" onClick={onClose} />

          {formAction ? (
            <form action={formAction}>
              <ButtonComponent
                type="submit"
                label={confirmLabel}
                variant={confirmColor === 'danger' ? 'danger' : 'primary'}
                size="sm"
                disabled={isLoading}
              />
            </form>
          ) : (
            <ButtonComponent
              type="button"
              label={confirmLabel}
              variant={confirmColor === 'danger' ? 'danger' : 'primary'}
              size="sm"
              onClick={onConfirm}
              disabled={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
