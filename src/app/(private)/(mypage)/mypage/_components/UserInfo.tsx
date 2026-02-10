import { UserInfoPropsType } from '@/types/userInfo.type';
import ChangePassWord from './ChangePassWord';
import ChangeUserId from './ChangeUserId';
import ChangeUserNickName from './ChangeUserNickName';
import AccountDeletion from './AccountDeletion';

const UserInfo = ({ userInfo }: UserInfoPropsType) => {
  const userInfoRows = [
    {
      label: '회원번호',
      desc: '고유 식별자 (변경 불가)',
      value: <span className="font-semibold">{userInfo?.id.split('-')[0].toUpperCase()}</span>,
    },
    {
      label: '닉네임',
      desc: '게시글/댓글에 표시됩니다',
      value: <ChangeUserNickName info={userInfo.nickname} />,
    },
    {
      label: '아이디',
      desc: '로그인에 사용됩니다',
      value: <ChangeUserId info={userInfo.email} />,
    },
    {
      label: '비밀번호',
      desc: '보안을 위해 주기적으로 변경하세요',
      value: <ChangePassWord />,
    },
  ];

  return (
    <div className="h-full rounded-2xl border border-default-200 bg-white overflow-hidden flex flex-col">
      {/* header */}
      <div className="px-5 py-4 border-b border-default-200">
        <h2 className="text-xs font-bold">계정 설정</h2>
        <p className="text-[8px] text-default-500 mt-1">회원 정보와 보안 설정을 관리합니다.</p>
      </div>

      {/* main 기능들*/}
      <div className="divide-y divide-default-200 border-b border-default-200">
        {userInfoRows.map((row) => (
          <div key={row.label} className="px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold">{row.label}</p>
              <p className="text-[8px] text-default-500 mt-1">{row.desc}</p>
            </div>
            <div className="shrink-0 flex justify-start sm:justify-end">{row.value}</div>
          </div>
        ))}
      </div>

      {/* 회원탈퇴 danger zone 카드 최하단으로 */}
      <div className="mt-auto border-t border-default-200 bg-red-200 px-5 py-4 box-border flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold text-danger">위험 영역</p>
          <p className="text-[8px] text-default-500 mt-1">회원탈퇴는 되돌릴 수 없습니다.</p>
          <span className="text-[8px] text-default-500">계정 및 관련 데이터가 삭제될 수 있어요.</span>
        </div>
        <AccountDeletion userInfo={userInfo.id} />
      </div>
    </div>
  );
};

export default UserInfo;
