export type AuthResetPasswordRequest = 'idle' | 'pending' | 'expired';
export type ValidateResetTokenResponse = {
  valid: boolean;
};
