type UserInfoType = {
  email: string;
  nickname: string;
  created_at: string;
  avatar: string | null;
  id: string;
  pending_email: string;
  pending_email_expires_at: string;
};

export type MypageUserInfo = Pick<UserInfoType, 'id' | 'email' | 'nickname' | 'avatar' | 'created_at'>;
