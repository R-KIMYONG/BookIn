import React, { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { EyeSlashFilledIcon } from '@/components/icons/EyeSlashFilledIcon';
import { EyeFilledIcon } from '@/components/icons/EyeFilledIcon';
import { PasswordFieldConfig, PasswordFieldKey } from '@/types/passwordField.type';
import ButtonComponent from '@/components/common/ButtonComponent';

const ChangePassWord = (): React.JSX.Element => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [visibility, setVisibility] = useState<Record<PasswordFieldKey, boolean>>({
    newPassword: false,
    confirmPassword: false,
  });
  const [changePassWord, setChangePassWord] = useState<{
    newChangePassWord: string;
    confirmChangePassWord: string;
  }>({
    newChangePassWord: '',
    confirmChangePassWord: '',
  });
  const supabase = createClient();
  const toggleVisibility = (item: keyof typeof visibility): void => {
    setVisibility((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setChangePassWord({
      ...changePassWord,
      [e.target.name]: e.target.value,
    });
  };
  const passwordRegex = useMemo<RegExp>(() => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, []);
  const handleSaveNewPassWord = useCallback<(onClose: () => void) => Promise<void>>(
    async (onClose) => {
      if (changePassWord.newChangePassWord.trim() === '' || changePassWord.confirmChangePassWord.trim() === '') {
        toast.error('모든 빈칸 채워주세요');
        return;
      }
      if (!passwordRegex.test(changePassWord.newChangePassWord)) {
        toast.error('비밀번호는 8자리 이상이어야 하며, 알파벳, 숫자 및 특수문자를 포함해야 합니다.');
        return;
      }
      if (changePassWord.newChangePassWord !== changePassWord.confirmChangePassWord) {
        toast.error('비밀번호가 일치하지 않습니다.');
        return;
      }
      try {
        const { error } = await supabase.auth.updateUser({
          password: changePassWord.newChangePassWord,
        });
        if (error) {
          throw error;
        }

        toast.success('비밀번호가 성공적으로 변경되었습니다.');
        onClose();
      } catch (error) {
        if (error instanceof AuthError) {
          console.error(`데이터 베이스에 비밀번호 갱신 실패 ${error.message}`);
        }
        console.error('DB에 비밀번호 갱신 요청 시 예상 치 못한 Error발생 했습니다.');
      }
    },
    [changePassWord, supabase, passwordRegex]
  );
  const passwordFields: PasswordFieldConfig[] = [
    {
      key: 'newPassword',
      name: 'newChangePassWord',
      label: '새로운 비밀번호',
      placeholder: '새로운 비밀번호 입력하세요',
    },
    {
      key: 'confirmPassword',
      name: 'confirmChangePassWord',
      label: '비밀번호 확인',
      placeholder: '새로운 비밀번호 다시 입력하세요',
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="sm" classNames={{ base: 'max-w-sm' }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">비밀번호 변경</ModalHeader>
              <ModalBody>
                {passwordFields.map((field) => (
                  <Input
                    key={field.name}
                    size="sm"
                    label={field.label}
                    placeholder={field.placeholder}
                    type={visibility[field.key] ? 'text' : 'password'}
                    variant="bordered"
                    name={field.name}
                    maxLength={15}
                    onChange={handleChange}
                    className="[&_input::placeholder]:text-[8px] sm:[&_input::placeholder]:text-[10px] md:[&_input::placeholder]:text-xs"
                    classNames={{
                      input: 'text-sm',
                      label: 'text-sm',
                      inputWrapper: 'h-12',
                    }}
                    endContent={
                      <ButtonComponent
                        type="button"
                        variant="ghost"
                        onClick={() => toggleVisibility(field.key)}
                        className="flex items-center justify-center"
                      >
                        {visibility[field.key] ? (
                          <EyeFilledIcon className="w-4 h-4 text-default-400" />
                        ) : (
                          <EyeSlashFilledIcon className="w-4 h-4 text-default-400" />
                        )}
                      </ButtonComponent>
                    }
                  />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} size="sm">
                  닫기
                </Button>
                <Button color="primary" onPress={() => handleSaveNewPassWord(onClose)} size="sm">
                  재설정
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ButtonComponent type="button" label="변경" variant="outline" size="xs" onClick={onOpen} />
    </>
  );
};

export default ChangePassWord;
