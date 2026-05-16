'use client';

import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import Button from '@/components/common/ui/Button';
import { MAX_LENGTH_NICKNME } from '@/shared/constants/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ReactElement, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';

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
      showToast(RESULT_CODE.AUTH_NICKNAME_SAME_AS_CURRENT);
      return;
    }

    if (nextNickname === '') {
      showToast(RESULT_CODE.VALIDATION_REQUIRED_NICKNAME);
      return;
    }

    try {
      await toastMutationPromise(changeNickNameMutation.mutateAsync(nextNickname), { pending: '닉네임 변경중...' });
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
        <Button
          type="submit"
          label="저장"
          isLoading={changeNickNameMutation.isPending}
          variant="primary"
          loadingText="저장중..."
          size="sm"
        />
      </div>
    </form>
  );
};

export default ChangeUserNickName;
