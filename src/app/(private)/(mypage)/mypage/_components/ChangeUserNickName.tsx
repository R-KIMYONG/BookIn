'use client';
import Button from '@/components/ButtonComponent';
import { createClient } from '@/utils/supabase/client';
import React, { FormEvent, useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const ChangeUserNickName = ({ info }: { info: string }): React.JSX.Element => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const changeInfoRef = useRef<string>(info);
  const supabase = createClient();

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleSaveNickname = useCallback(async (): Promise<void> => {
    setIsEditing(false);
    const changeInfo = changeInfoRef.current;
    if (changeInfo.trim() === '') {
      toast.warning(`빈칸으로 변경할 수 없습니다.`, {
        position: 'top-right',
      });
      return;
    }
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('사용자 정보를 가져오는 중 오류 발생');
      }
      const userId = userData.user.id;

      const { error } = await supabase.from('users').update({ nickname: changeInfo }).eq('id', userId).single();

      if (error) throw error;

      const { error: authError } = await supabase.auth.updateUser({
        data: { nickname: changeInfo },
      });

      if (authError) {
        throw authError;
      }
      toast.success(`닉네임이 성공적으로 변경되었습니다.`, {
        position: 'top-right',
      });
    } catch (error) {
      console.error(`'닉네임 업데이트 중 오류 발생:`, error);
      toast.error(`'닉네임 업데이트 중 오류가 발생했습니다.`, {
        position: 'top-right',
      });
    }
  }, [changeInfoRef, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    changeInfoRef.current = e.target.value;
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
          defaultValue={changeInfoRef.current}
          className="text-xs outline-dashed pl-2 py-1 rounded block box-border"
          onChange={handleChange}
          maxLength={8}
          autoFocus
        />

        <div className="flex gap-2">
          <Button type="button" label="취소" style="bg-[#af5858] text-white" onClick={() => setIsEditing(false)} />
          <Button type="submit" label="저장" style="bg-[#af5858] text-white" />
        </div>
      </form>
    );
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs">{changeInfoRef.current}</p>
      <Button type="button" label="변경" style="bg-[#af5858] text-white" onClick={handleEdit} />
    </div>
  );
};

export default ChangeUserNickName;
