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
            sizes="(max-width: 640px) 80px, 96px"
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
  );
};

export default ProfileCard;
