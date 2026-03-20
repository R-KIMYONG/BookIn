'use client';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { MypageUserInfo } from '@/types/userInfo.type';
import UserInfo from './UserInfo';
import BookComments from './BookComments';
import ButtonComponent from '@/components/common/ButtonComponent';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';
import { MypageSectionType } from '@/types/useMypageUrlState.type';
import { logout } from '@/app/actions/auth.actions';
import useUser from '@/hooks/useUser';
import MypageSkeleton from './MypageSkeleton';
import AvatarUploadSection from './AvatarUploadSection';

const Mypage = (): React.JSX.Element => {
  const supabase = createClient();
  const { mypageSection, setMypageUrl } = useMypageUrlState();
  const { data: authUser, isPending: isUserPending } = useUser();
  const {
    data: userInfo,
    isPending: isUserInfoPending,
    isError,
    error,
  } = useQuery<MypageUserInfo, Error>({
    queryKey: ['userInfo', authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) {
        throw new Error('[Mypage] 로그인 사용자 정보가 없습니다.');
      }
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id,email,nickname,avatar')
        .eq('id', authUser.id)
        .maybeSingle();

      if (userError) {
        throw new Error(userError.message);
      }
      //회원가입하고 회원탈퇴 그리고 다시 회원가입 시 오류 발생
      if (!user) {
        throw new Error('[Mypage] 사용자 프로필 정보를 찾을 수 없습니다.');
      }

      return {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar ?? '',
      };
    },
    throwOnError: true,
    enabled: !!authUser?.id,
  });

  const profileTabs = [
    { label: '회원정보', sectionType: 'userInfo' as MypageSectionType },
    { label: '댓글목록', sectionType: 'commentList' as MypageSectionType },
  ];
  if (isUserPending || isUserInfoPending) {
    return <MypageSkeleton />;
  }
  if (isError) {
    console.error(error);
    throw error;
  }
  return (
    <>
      <div className="flex justify-between gap-4 sm:w-full mx-auto items-stretch min-h-[calc(100vh-3rem)]">
        <div className="bg-[#af5858] w-1/6 self-stretch flex flex-col items-center justify-center gap-5 text-xs [transform:translateZ(0)]">
          <AvatarUploadSection userAvatar={userInfo.avatar} userId={userInfo.id} />
          <div className="text-center text-white font-bold">
            <h3>환영합니다.</h3>
            <p>{userInfo.nickname}님</p>
          </div>
          <nav className="w-full">
            <ul className="w-full">
              {profileTabs.map((tab, index) => (
                <li key={index} className="text-center w-full">
                  <ButtonComponent
                    className={`!text-white ${mypageSection === tab.sectionType ? '!bg-[#783A3A]' : '!bg-[#af5858]'}`}
                    size="md"
                    fullWidth={true}
                    variant="ghost"
                    onClick={() =>
                      setMypageUrl({ section: tab.sectionType, page: tab.sectionType !== 'userInfo' ? 1 : null })
                    }
                    label={tab.label}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <form action={logout}>
            <input type="hidden" name="next" value="/" />
            <ButtonComponent type="submit" label="로그아웃" variant="outline" size="xs" />
          </form>
        </div>
        <div className="w-5/6 min-w-0 self-stretch flex flex-col justify-between [contain:layout_paint]">
          <div className="flex-1 min-h-0">
            {mypageSection === 'userInfo' ? <UserInfo userInfo={userInfo} /> : <BookComments userInfo={userInfo} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mypage;
