import { ButtonVariant } from './button.type';

export type PendingEmailData = {
  pendingEmail: string;
  emailExpireAt: number | null;
};

export type ActionButton = {
  key: string;
  label: string;
  variant: ButtonVariant;
  type: 'button' | 'submit';
  disabled: boolean;
  onClick?: () => void;
};

export type ActionButtons = ActionButton[];
