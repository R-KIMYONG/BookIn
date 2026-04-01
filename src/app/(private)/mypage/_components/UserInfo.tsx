import { MypageUserInfo } from '@/types/userInfo.type';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import ButtonComponent from '@/components/common/ui/ButtonComponent';
import { useRouter } from 'next/navigation';

const UserInfo = ({ userInfo }: { userInfo: MypageUserInfo }) => {
  const router = useRouter();
  const created = dayjs(userInfo.created_at).startOf('day');
  const today = dayjs().startOf('day');
  const diff = today.diff(created, 'day');
  const userInfoRows = useMemo(
    () => [
      {
        label: '가입일',
        desc: '계정을 처음 생성한 날짜입니다.',
        value: `${created.format('YYYY.MM.DD')} (가입 ${diff}일째)`,
      },
      {
        label: '닉네임',
        desc: '게시글/댓글에 표시됩니다',
        value: userInfo.nickname,
      },
      {
        label: '아이디',
        desc: '로그인에 사용됩니다',
        value: userInfo.email,
      },
    ],
    [created, diff, userInfo.nickname, userInfo.email]
  );

  return (
    <section className="flex flex-col">
      {/* header */}
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-base font-extrabold text-gray-900 sm:text-lg">계정 정보</h2>
          <p className="mt-1 text-sm text-gray-500">프로필과 계정 정보를 확인할 수 있습니다.</p>
        </div>

        <div className="shrink-0">
          <ButtonComponent label="설정" size="sm" variant="outline" onClick={() => router.push('/settings')} />
        </div>
      </div>

      {/* rows */}
      <div className="divide-y divide-gray-100">
        {userInfoRows.map((row) => (
          <div key={row.label} className="py-5">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{row.label}</p>
                <p className="mt-1 text-sm text-gray-500">{row.desc}</p>
              </div>

              <div>
                <p className="inline-flex max-w-full rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 break-all">
                  {row.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserInfo;
