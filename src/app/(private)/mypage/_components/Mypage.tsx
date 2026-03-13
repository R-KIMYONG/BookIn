'use client';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { UserInfoType } from '@/types/userInfo.type';
import UserInfo from './UserInfo';
import BookComments from './BookComments';
import ButtonComponent from '@/components/common/ButtonComponent';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';
import { MypageQueryType } from '@/types/useMypageUrlState.type';
import { logout } from '@/app/actions/auth.actions';
import useUser from '@/hooks/useUser';
import MypageSkeleton from './MypageSkeleton';

const Mypage = (): React.JSX.Element => {
  const avatarImgRef = useRef<HTMLInputElement>(null);
  const [localUserInfo, setLocalUserInfo] = useState<UserInfoType | null>(null);
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { mypageQueryType, setMypageUrl } = useMypageUrlState();
  const { data: authUser, isPending: isUserPending } = useUser();
  const {
    data: userInfo,
    isPending: isUserInfoPending,
    isError,
    error,
  } = useQuery<UserInfoType, Error>({
    queryKey: ['userInfo', authUser?.id],
    queryFn: async () => {
      try {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser!.id)
          .single();

        if (userError || !user) {
          throw new Error('User data retrieval error');
        }
        const userData: UserInfoType = {
          email: user.email || '',
          nickname: user.nickname || '',
          id: user.id,
          created_at: user.created_at,
          avatar: user.avatar || '',
          pending_email: user.pending_email || '',
          pending_email_expires_at: user.pending_email_expires_at || '',
        };

        return userData;
      } catch (error) {
        if (error instanceof SupabaseAuthClient) {
          throw new Error('supabase error');
        }
        throw new Error('예상치못한 에러 발생 from getUser함수부분');
      }
    },
    throwOnError: true,
    enabled: !!authUser?.id,
  });
  const updateAvatarImg = useMutation<string, Error, string, UserInfoType>({
    mutationFn: async (imgURL) => {
      const { error } = await supabase.from('users').update({ avatar: imgURL }).eq('id', userInfo!.id);

      if (error) {
        throw new Error(error.message);
      }
      return imgURL;
    },
    onSuccess: (updatedImgURL) => {
      setLocalUserInfo((prevState) => (prevState ? { ...prevState, avatar: updatedImgURL } : null));
      queryClient.invalidateQueries({ queryKey: ['userInfo', authUser?.id] });
    },
  });

  const handleAvatarUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files!;
      const fileExtension = ['.jpg', '.jpeg', '.png', '.gif'];
      const maxFileSize = 5 * 1024 * 1024;
      if (!files['0']) {
        toast.error('아바타 업로드 취소하셨습니다.', {
          position: 'top-right',
        });
        return;
      }
      const userUploadfileExtension = files['0'].name.split('.').pop()?.toLowerCase();
      if (!fileExtension.includes(`.${userUploadfileExtension}`)) {
        console.error('지원하지 않는 파일 형식입니다. JPG, JPEG, PNG, GIF 파일만 업로드 가능합니다.');
        toast.error('지원하지 않는 파일 형식입니다. JPG, JPEG, PNG, GIF 파일만 업로드 가능합니다.', {
          position: 'top-right',
        });
        return;
      }
      if (files[0].size > maxFileSize) {
        console.error('파일 용량이 초과되었습니다. 5MB 이하의 파일만 업로드 가능합니다.');
        toast.error('파일 용량이 초과되었습니다. 5MB 이하의 파일만 업로드 가능합니다.', {
          position: 'top-right',
        });
        return;
      }
      try {
        const sanitizedFileName = files[0].name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
        const { data, error } = await supabase.storage.from('avatars').upload(`avatar_${sanitizedFileName}`, files[0], {
          cacheControl: '3600',
          upsert: true,
        });

        if (error) {
          throw error;
        }

        const imgURL = `https://vshtzcektgnzzfgtstdy.supabase.co/storage/v1/object/public/avatars/${
          data.path
        }?t=${Date.now()}`;

        updateAvatarImg.mutate(imgURL);
        toast.success('아바타 업로드 완료!', {
          position: 'top-right',
        });
      } catch (error) {
        console.error('파일 업로드 또는 데이터 저장 중 에러 발생:');
        toast.error('파일 업로드 또는 데이터 저장 중 에러 발생', {
          position: 'top-right',
        });
      }
    },
    [supabase, updateAvatarImg]
  );

  const profileTabs = [
    { label: '회원정보', queryType: 'userInfo' as MypageQueryType },
    { label: '댓글목록', queryType: 'commentList' as MypageQueryType },
  ];
  if (isUserPending || isUserInfoPending) {
    return <MypageSkeleton />;
  }
  if (isError) throw error;
  return (
    <>
      <div className="flex justify-between gap-4 sm:w-full mx-auto items-stretch min-h-[calc(100vh-3rem)]">
        <div className="bg-[#af5858] w-1/6 self-stretch flex flex-col items-center justify-center gap-5 text-xs [transform:translateZ(0)]">
          <div className="relative aspect-square w-14 sm:w-16 md:w-20 lg:w-24 overflow-hidden box-border">
            <Image
              src={localUserInfo?.avatar || userInfo?.avatar || '/images/noImg.png'}
              alt="avatarImg"
              className="object-cover"
              priority
              fill
            />
          </div>
          <div>
            <ButtonComponent
              type="button"
              label="업로드"
              variant="outline"
              size="xs"
              onClick={() => avatarImgRef.current?.click()}
            />

            <input
              ref={avatarImgRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleAvatarUpload}
            />
          </div>
          <div className="text-center text-white font-bold">
            <h3>환영합니다.</h3>
            <p>{userInfo?.nickname}님</p>
          </div>
          <nav className="w-full">
            <ul className="w-full">
              {profileTabs.map((tab, index) => (
                <li key={index} className="text-center w-full">
                  <ButtonComponent
                    className={`!text-white ${mypageQueryType === tab.queryType ? '!bg-[#783A3A]' : '!bg-[#af5858]'}`}
                    size="md"
                    fullWidth={true}
                    variant="ghost"
                    onClick={() =>
                      setMypageUrl({ queryType: tab.queryType, page: tab.queryType !== 'userInfo' ? 1 : null })
                    }
                    label={tab.label}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <form action={logout}>
            <ButtonComponent type="button" label="로그아웃" variant="outline" size="xs" />
          </form>
        </div>
        <div className="w-5/6 min-w-0 self-stretch flex flex-col justify-between [contain:layout_paint]">
          <div className="flex-1 min-h-0">
            {mypageQueryType === 'userInfo'
              ? userInfo && <UserInfo userInfo={userInfo} />
              : userInfo && <BookComments userInfo={userInfo} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mypage;
