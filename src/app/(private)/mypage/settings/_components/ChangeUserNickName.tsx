'use client';

import toastMutationPromise from '@/app/lib/toast/toastMutationPromise';
import ButtonComponent from '@/components/common/ui/ButtonComponent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ReactElement, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

export const MAX_LENGTH_NICKNME = 10;
const ChangeUserNickName = ({ nickname, userId }: { nickname: string; userId: string }): ReactElement => {
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
    onSuccess: (result) => {
      if (result?.user) {
        queryClient.setQueriesData({ queryKey: ['userInfo', userId] }, result.user);
      } else {
        queryClient.invalidateQueries({ queryKey: ['userInfo', userId] });
      }
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

  return (
    <form
      className="space-y-4"
      onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSaveNickname();
      }}
    >
      <div>
        <label htmlFor="nickname" className="mb-2 block text-sm font-semibold text-gray-900">
          새 닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={draftNickname}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#AF5858]"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDraftNickname(e.target.value);
          }}
          maxLength={MAX_LENGTH_NICKNME}
        />
        <p className="mt-2 text-xs text-gray-400">최대 {MAX_LENGTH_NICKNME}자까지 입력할 수 있습니다.</p>
      </div>

      <div className="flex justify-end">
        <ButtonComponent
          type="submit"
          label={changeNickNameMutation.isPending ? '저장중...' : '저장'}
          variant="primary"
          size="sm"
          disabled={changeNickNameMutation.isPending}
        />
      </div>
    </form>
  );
};

export default ChangeUserNickName;
