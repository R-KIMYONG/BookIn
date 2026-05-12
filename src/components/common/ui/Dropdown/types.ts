import { ButtonVariant } from '../Button/type';

export type DropdownItem<T> =
  | { type: 'action'; label: string; value: T; renderType?: 'list' | 'button' }
  | { type: 'custom'; content: React.ReactNode };

export type DropdownProps<T> = {
  trigger: React.ReactNode;
  items: DropdownItem<T>[];
  onSelect: (value: T) => void;
  align?: 'left' | 'right';
  variant?: ButtonVariant;
};
