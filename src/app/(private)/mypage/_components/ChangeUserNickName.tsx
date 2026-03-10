'use client';

import ButtonComponent from '@/components/common/ButtonComponent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const ChangeUserNickName = ({ nickname, userId }: { nickname: string; userId: string }): React.JSX.Element => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const changeInfoRef = useRef<string>(nickname);
  const queryClient = useQueryClient();

  const changeNickNameMutation = useMutation({
    mutationFn: async (nickname: string) => {
      const res = await fetch('/api/user/nickname', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message ?? '닉네임 변경 실패');
      }

      return result;
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['userInfo', userId] });
      toast.success('닉네임이 성공적으로 변경되었습니다.', {
        position: 'top-right',
      });
    },
    onError: (error) => {
      console.error('닉네임 업데이트 중 오류 발생:', error);
      toast.error('닉네임 업데이트 중 오류가 발생했습니다.', {
        position: 'top-right',
      });
    },
  });

  const handleSaveNickname = useCallback(async (): Promise<void> => {
    const changeInfo = changeInfoRef.current.trim();

    if (changeInfo === '') {
      toast.warning('빈칸으로 변경할 수 없습니다.', {
        position: 'top-right',
      });
      return;
    }

    changeNickNameMutation.mutate(changeInfo);
  }, [changeNickNameMutation]);

  if (isEditing) {
    return (
      <form
        className="flex items-center justify-between gap-2"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleSaveNickname();
        }}
      >
        <input
          type="text"
          defaultValue={changeInfoRef.current}
          className="text-xs outline-dashed pl-2 py-1 rounded block box-border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            changeInfoRef.current = e.target.value;
          }}
          maxLength={8}
          autoFocus
        />

        <div className="flex gap-2">
          <ButtonComponent
            type="button"
            label="취소"
            variant="secondary"
            size="xs"
            onClick={() => setIsEditing(false)}
          />
          <ButtonComponent type="submit" label="저장" variant="primary" size="xs" />
        </div>
      </form>
    );
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs">{changeInfoRef.current}</p>
      <ButtonComponent type="button" label="변경" variant="outline" size="xs" onClick={() => setIsEditing(true)} />
    </div>
  );
};

export default ChangeUserNickName;
