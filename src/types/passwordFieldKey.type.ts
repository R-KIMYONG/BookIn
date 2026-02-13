export type PasswordFieldKey = 'newPassword' | 'confirmPassword';

type PasswordFieldName = 'newChangePassWord' | 'confirmChangePassWord';

export type PasswordFieldConfig = {
  key: PasswordFieldKey;
  name: PasswordFieldName;
  label: string;
  placeholder: string;
};