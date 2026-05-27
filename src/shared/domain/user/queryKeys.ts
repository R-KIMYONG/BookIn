export const userKeys = {
  all: ['user'] as const,
  //현재 로그인 사용자
  me: () => [...userKeys.all, 'me'] as const,

  // 이메일 변경 인증 상태
  pendingEmail: () => [...userKeys.me(), 'pending-email'] as const,

  //공개 유저 프로필
  profile: (userId: string) => [...userKeys.all, 'profile', userId] as const,
};
