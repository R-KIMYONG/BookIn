import { useEffect } from 'react';
import Button from '../common/ui/Button';

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
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={!isLoading ? onClose : undefined} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        <p className="text-sm text-gray-700 whitespace-pre-line mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button type="button" label={cancelLabel} variant="secondary" size="sm" onClick={onClose} />

          {formAction ? (
            <form action={formAction}>
              <Button
                type="submit"
                label={confirmLabel}
                variant={confirmColor === 'danger' ? 'danger' : 'primary'}
                size="sm"
                disabled={isLoading}
              />
            </form>
          ) : (
            <Button
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
