export const authKeys = {
  passwordReset: (email: string) => ['passwordReset', email] as const,
  validateResetToken: (token: string) => ['auth', 'resetToken', token] as const,
};
