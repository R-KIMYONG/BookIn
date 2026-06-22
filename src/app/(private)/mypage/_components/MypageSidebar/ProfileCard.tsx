import { formatDate } from '@/shared/lib/date/formatDate';
import { createClient } from '@/shared/lib/supabase/server';
import { Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ProfileCard = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from('users').select('nickname, avatar').eq('id', user.id).single();
  const avatar = profile?.avatar || '/images/noImg.png';

  const nickname = profile?.nickname;

  return (
    <div className="bg-white px-4 py-3 sm:px-6 border-b border-gray-100">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border bg-gray-50 shrink-0">
            <Link href={'/mypage/settings'}>
              <Image src={avatar} alt="avatarImg" className="object-cover cursor-pointer" sizes="44px" fill />
            </Link>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900 truncate">{nickname}님</h2>

              <span className="text-[11px] text-gray-400 shrink-0">{formatDate(user.created_at)} 가입</span>
            </div>

            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <Link href={'/mypage/settings'}>
          <Settings className="text-gray-700 w-5 h-5 transform hover:rotate-180 duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
