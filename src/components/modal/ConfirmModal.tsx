import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="sm"
      classNames={{ base: 'max-w-sm' }}
      isDismissable={!isLoading}
      shouldBlockScroll={true}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>

            <ModalBody>
              <p className="text-sm text-gray-700 whitespace-pre-line">{message}</p>
            </ModalBody>

            <ModalFooter>
              <Button color="default" variant="flat" size="sm" onPress={onClose} isDisabled={isLoading}>
                {cancelLabel}
              </Button>
              {formAction ? (
                //  server action용
                <form action={formAction} className="contents">
                  <Button type="submit" color={confirmColor} size="sm" isLoading={isLoading}>
                    {confirmLabel}
                  </Button>
                </form>
              ) : (
                // 기존 방식 유지
                <Button color={confirmColor} size="sm" onPress={onConfirm} isLoading={isLoading}>
                  {confirmLabel}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
