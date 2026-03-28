import type { Metadata } from 'next';
import MypageSettingsSection from './_components/MypageSettingsSection';

export const metadata: Metadata = {
  title: '계정 설정',
  description: '프로필, 계정, 보안 정보를 수정할 수 있습니다.',
};

const MypageSettingsPage = () => {
  return <MypageSettingsSection />;
};

export default MypageSettingsPage;
