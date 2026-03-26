'use client';

import toastMutationPromise from '@/app/lib/toast/toastMutationPromise';
import ButtonComponent from '@/components/common/ButtonComponent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

const ChangeUserNickName = ({ nickname, userId }: { nickname: string; userId: string }): React.JSX.Element => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftNickname, setDraftNickname] = useState<string>(nickname);
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
    },
  });

  const handleSaveNickname = useCallback(async (): Promise<void> => {
    const nextNickname = draftNickname.trim();

    if (nextNickname === nickname) {
      toast.info('현재 사용 중인 닉네임입니다.', {
        position: 'top-right',
      });
      return;
    }

    if (nextNickname === '') {
      toast.warning('빈칸으로 변경할 수 없습니다.', {
        position: 'top-right',
      });
      return;
    }

    try {
      await toastMutationPromise(changeNickNameMutation.mutateAsync(nextNickname), '닉네임 변경중...');
    } catch (error) {
      console.error(error);
    }
  }, [changeNickNameMutation, draftNickname, nickname]);

  const handleOpenEdit = () => {
    setDraftNickname(nickname);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftNickname(nickname);
    setIsEditing(false);
  };

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
          value={draftNickname}
          className="text-xs outline-dashed pl-2 py-1 rounded block box-border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDraftNickname(e.target.value);
          }}
          maxLength={8}
          autoFocus
        />

        <div className="flex gap-2">
          <ButtonComponent type="button" label="취소" variant="secondary" size="xs" onClick={handleCancelEdit} />
          <ButtonComponent
            type="submit"
            label={changeNickNameMutation.isPending ? '저장중...' : '저장'}
            variant="primary"
            size="xs"
            disabled={changeNickNameMutation.isPending}
          />
        </div>
      </form>
    );
  }
  return (
    <div className="flex items-center justify-between">
      <ButtonComponent type="button" label="변경" variant="outline" size="xs" onClick={handleOpenEdit} />
    </div>
  );
};

export default ChangeUserNickName;
