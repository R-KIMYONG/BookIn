import ButtonComponent from '@/components/common/ui/ButtonComponent';
import { MypageUserInfo } from '@/types/userInfo.type';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RiSettings5Fill } from 'react-icons/ri';

const ProfileCard = ({ userInfo }: { userInfo: MypageUserInfo }) => {
  const router = useRouter();
  const created = dayjs(userInfo?.created_at);

  return (
    <div className="bg-white px-4 py-3 sm:px-6 border-b border-gray-100">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border bg-gray-50 shrink-0">
            <Image
              src={userInfo.avatar || '/images/noImg.png'}
              alt="avatarImg"
              className="object-cover cursor-pointer"
              sizes="44px"
              priority
              fill
              onClick={() => router.push('/mypage/settings')}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900 truncate">{userInfo.nickname}님</h2>

              <span className="text-[11px] text-gray-400 shrink-0">{created.format('YYYY.MM.DD')} 가입</span>
            </div>

            <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
          </div>
        </div>

        <ButtonComponent
          size="xs"
          variant="ghost"
          onClick={() => router.push('/mypage/settings')}
          className="!min-w-0 !rounded-full !p-2 !bg-gray-100 hover:!bg-gray-200"
        >
          <RiSettings5Fill className="text-gray-700 text-lg" />
        </ButtonComponent>
      </div>
    </div>
  );
};

export default ProfileCard;
