'use client';

import { useFormStatus } from 'react-dom';
import Button from '@/components/common/ui/Button';

type FormSubmitButtonProps = {
  label?: string;
  children?: React.ReactNode;
  loadingText?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
  fullWidth?: boolean;
  ariaLabel?: string;
};

const FormSubmitButton = ({
  label,
  children,
  loadingText,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth,
  ariaLabel,
}: FormSubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={pending}
      loadingText={loadingText}
      className={className}
      aria-label={ariaLabel}
    >
      {children ?? label}
    </Button>
  );
};

export default FormSubmitButton;
