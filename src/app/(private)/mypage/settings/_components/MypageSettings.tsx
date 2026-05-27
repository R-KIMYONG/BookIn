'use client';

import Button from '@/components/common/ui/Button';
import { useRouter } from 'next/navigation';
import AvatarUploadSection from './AvatarUploadSection';
import ChangeUserNickName from './ChangeUserNickName';
import ChangeUserId from './ChangeUserId';
import ChangePassWord from './ChangePassWord';
import AccountDeletion from './AccountDeletion';
import useMe from '@/hooks/auth/useMe';
import { ArrowLeft, House, Settings } from 'lucide-react';
import { formatDateTime } from '@/shared/lib/date/formatDateTime';

const MypageSettings = () => {
  const router = useRouter();

  const { data: userInfo, isError, error } = useMe();
  const currentAvatarSrc = userInfo?.avatar || '/images/noImg.png';

  if (isError) {
    throw error;
  }

  if (!userInfo) {
    throw new Error('설정 정보를 불러오지 못했습니다.');
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        {/* 헤더 */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Button
                type="button"
                onClick={() => router.push('/mypage')}
                variant="ghost"
                label="마이페이지"
                leftIcon={<ArrowLeft className="w-4- h-4" />}
              />

              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#AF5858]" />
                <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">계정 설정</h1>
              </div>

              <p className="mt-2 text-sm text-gray-500">현재 정보를 확인하고 필요한 항목만 수정하세요.</p>
            </div>

            <div className="shrink-0">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<House className="w-4 h-4" />}
                onClick={() => router.push('/')}
              >
                홈으로
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* 좌측 요약 패널 */}
          <aside className="border-b border-gray-100 bg-gray-50/60 p-5 lg:border-b-0 lg:border-r lg:border-gray-100 lg:p-6">
            <div className="mx-auto flex max-w-xs flex-col items-center text-center">
              <AvatarUploadSection userAvatar={currentAvatarSrc} />

              <h2 className="mt-5 text-lg font-extrabold text-gray-900">{userInfo.nickname}</h2>
              <p className="mt-1 break-all text-sm text-gray-500">{userInfo.email}</p>
              <p className="mt-2 text-xs text-gray-400">{formatDateTime(userInfo.created_at)} 가입</p>

              <div className="mt-6 w-full rounded-2xl border border-gray-200 bg-white p-4 text-left">
                <p className="text-sm font-semibold text-gray-900">현재 정보</p>

                <dl className="mt-3 space-y-3">
                  <div>
                    <dt className="text-xs text-gray-400">닉네임</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">{userInfo.nickname}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400">이메일</dt>
                    <dd className="mt-1 break-all text-sm font-medium text-gray-900">{userInfo.email}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>

          {/* 우측 수정 영역 */}
          <section className="p-5 sm:p-6">
            <div className="space-y-6">
              {/* 프로필 */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900">프로필</h3>
                  <p className="mt-1 text-sm text-gray-500">닉네임을 변경할 수 있습니다.</p>
                </div>
                <ChangeUserNickName nickname={userInfo.nickname} />
              </section>
              {/* 계정 */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900">계정</h3>
                  <p className="mt-1 text-sm text-gray-500">로그인에 사용하는 이메일을 변경할 수 있습니다.</p>
                </div>
                <ChangeUserId email={userInfo.email} />
              </section>

              {/* 보안 */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900">보안</h3>
                  <p className="mt-1 text-sm text-gray-500">비밀번호를 변경해 계정을 더 안전하게 관리하세요.</p>
                </div>

                <ChangePassWord />
              </section>

              {/* 위험 영역 */}
              <section className="rounded-2xl border border-red-100 bg-red-50/70 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-red-600">위험 영역</h3>
                    <p className="mt-1 text-sm text-gray-600">회원탈퇴는 되돌릴 수 없습니다.</p>
                    <p className="mt-1 text-sm text-gray-500">계정 및 관련 데이터가 삭제될 수 있습니다.</p>
                  </div>

                  <div className="shrink-0">
                    <AccountDeletion />
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MypageSettings;
