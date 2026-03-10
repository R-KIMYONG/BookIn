import { TempSessionModalProps } from '@/types/useCountDownOptions.type';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';

const TempSessionModal = ({
  isOpen,
  remainingSec,
  countDownText,
  isExpired,
  onClose,
  onExtend,
  onGoLogin,
}: TempSessionModalProps) => {
  const isReallyExpired = isExpired || remainingSec <= 0;

  return (
    <Modal isOpen={isOpen} placement="center" size="sm" classNames={{ base: 'max-w-sm' }}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isReallyExpired ? '로그인이 만료되었습니다' : '로그인 연장하시겠습니까?'}
            </ModalHeader>

            <ModalBody>
              {isReallyExpired ? (
                <>
                  <p className="text-sm text-gray-700">장시간 활동이 없어 자동 로그아웃되었습니다.</p>
                  <p className="text-sm text-gray-700">계속 이용하려면 다시 로그인해주세요.</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-700">로그인 세션이 곧 만료됩니다.</p>
                  <p className="text-sm text-gray-700">계속 이용하시려면 지금 연장해주세요.</p>
                  <p className="mt-2 text-xs text-gray-400">연장 시 로그인 시간이 2시간으로 초기화됩니다.</p>
                  {countDownText ? (
                    <p className="mt-2 text-xs text-gray-500">
                      남은 시간: <b>{countDownText}</b>
                    </p>
                  ) : null}
                </>
              )}
            </ModalBody>

            <ModalFooter>
              {isReallyExpired ? (
                <>
                  <Button color="default" variant="flat" size="sm" onPress={onClose}>
                    닫기
                  </Button>
                  <Button color="primary" size="sm" onPress={onGoLogin}>
                    로그인 하러가기
                  </Button>
                </>
              ) : (
                <>
                  <Button color="default" variant="flat" size="sm" onPress={onClose}>
                    나중에
                  </Button>
                  <Button color="primary" size="sm" onPress={onExtend}>
                    연장하기
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TempSessionModal;
