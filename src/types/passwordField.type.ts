export type PasswordFieldKey = 'newPassword' | 'confirmPassword';

type PasswordFieldName = 'newChangePassWord' | 'confirmChangePassWord';

export type PasswordFieldConfig = {
  key: PasswordFieldKey;
  name: PasswordFieldName;
  label: string;
  placeholder: string;
};

export type PasswordFieldsProps = {
  withConfirm?: boolean;
  passwordLabel?: string;
  confirmLabel?: string;
  passwordPlaceholder?: string;
  confirmPlaceholder?: string;
  passwordName?: string;
  confirmName?: string;
  required?: boolean;
  showHint?: boolean;
  className?: string;
  passwordValue?: string;
  confirmValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
