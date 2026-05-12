export const isValidPassword = (password: string): boolean => {
  const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
  return PASSWORD_REGEX.test(password);
};
