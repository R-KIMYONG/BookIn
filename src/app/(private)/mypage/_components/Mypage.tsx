'use client';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { MypageUserInfo } from '@/types/userInfo.type';
import UserInfo from './UserInfo';
import BookComments from './BookComments';
import ButtonComponent from '@/components/common/ButtonComponent';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';
import { MypageSectionType } from '@/types/useMypageUrlState.type';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { RiSettings5Fill } from 'react-icons/ri';
import Image from 'next/image';

const Mypage = ({ userId }: { userId: string }): React.JSX.Element => {
  const supabase = createClient();
  const router = useRouter();
  const { mypageSection, setMypageUrl } = useMypageUrlState();
  const {
    data: userInfo,
    isError,
    error,
  } = useQuery<MypageUserInfo, Error>({
    queryKey: ['userInfo', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('[Mypage] 로그인 사용자 정보가 없습니다.');
      }
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id,email,nickname,avatar,created_at')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        throw new Error(userError.message);
      }
      //회원가입하고 회원탈퇴 그리고 다시 회원가입 시 오류 발생
      if (!user) {
        throw new Error('[Mypage] 사용자 프로필 정보를 찾을 수 없습니다.');
      }

      return user;
    },
    throwOnError: true,
    enabled: !!userId,
  });
  const created = dayjs(userInfo?.created_at);

  const profileTabs = [
    { label: '회원정보', sectionType: 'userInfo' as MypageSectionType },
    { label: '댓글목록', sectionType: 'commentList' as MypageSectionType },
  ];

  if (isError) throw error;

  if (!userInfo) throw new Error('마이페이지 정보를 불러오지 못했습니다.');
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {/* 모바일: 상단 프로필 카드 / 데스크톱: 좌측 패널 */}
        <aside className="w-full lg:w-[280px] lg:shrink-0">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-24">
            {/* 프로필 헤더 */}
            <div className="bg-gradient-to-br from-[#af5858] via-[#9d4f4f] to-[#7f3f3f] px-5 py-6 text-white flex justify-center relative">
              <div className="absolute right-4 top-4">
                <ButtonComponent
                  size="xs"
                  variant="ghost"
                  onClick={() => router.push('/mypage/settings')}
                  className="!min-w-0 !rounded-full !p-2 !bg-white/10 hover:!bg-white/20"
                >
                  <RiSettings5Fill className="text-white text-lg" />
                </ButtonComponent>
              </div>
              <div className="flex flex-row items-center md:gap-4  gap-6">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/80 bg-white shadow-md sm:h-24 sm:w-24">
                  <Image
                    src={userInfo.avatar || '/images/noImg.png'}
                    alt="avatarImg"
                    className="object-cover"
                    priority
                    fill
                  />
                </div>

                <div className="flex flex-col justify-center text-left gap-1">
                  <h2 className="text-lg font-extrabold">{userInfo.nickname}님</h2>
                  <p className="text-xs text-white/80 break-all">{userInfo.email}</p>
                  <p className="text-xs text-white/80 break-all">{`${created.format('YYYY.MM.DD')} 가입`}</p>
                </div>
              </div>
            </div>

            {/* 모바일/데스크톱 공용 탭 */}
            <div className="px-3 py-3">
              <nav>
                <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {profileTabs.map((tab) => {
                    const isActive = mypageSection === tab.sectionType;

                    return (
                      <li key={tab.sectionType}>
                        <ButtonComponent
                          className={`!rounded-2xl !border !transition-all
                            ${
                              isActive
                                ? '!border-[#af5858] !bg-[#af5858] !text-white'
                                : '!border-gray-200 !bg-white !text-gray-700 hover:!border-[#af5858] hover:!text-[#af5858]'
                            }`}
                          size="md"
                          fullWidth={true}
                          variant="ghost"
                          onClick={() =>
                            setMypageUrl({
                              section: tab.sectionType,
                              page: tab.sectionType !== 'userInfo' ? 1 : null,
                            })
                          }
                          label={tab.label}
                        />
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </aside>

        {/* 본문 */}
        <main className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <h3 className="text-base font-extrabold text-gray-900 sm:text-lg">
                {mypageSection === 'userInfo' ? '회원정보' : '댓글목록'}
              </h3>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {mypageSection === 'userInfo'
                  ? '프로필과 계정 정보를 확인하고 수정할 수 있습니다.'
                  : '내가 작성한 댓글 활동을 확인할 수 있습니다.'}
              </p>
            </div>

            <div className="px-4 py-5 sm:px-6">
              {mypageSection === 'userInfo' ? <UserInfo userInfo={userInfo} /> : <BookComments userInfo={userInfo} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Mypage;
