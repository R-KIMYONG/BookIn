export const AUTH_CHANNEL = 'bookin-auth';
export type AuthChangedMessage = { type: 'AUTH_CHANGED'; userId: string | null } | { type: 'INVALIDATE_USERINFO' };
