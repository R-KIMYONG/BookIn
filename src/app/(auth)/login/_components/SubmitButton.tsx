'use client';

import { useFormStatus } from 'react-dom';
import ButtonComponent from '@/components/common/ButtonComponent';

type SubmitButtonProps = {
  label: string;
};

export default function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <ButtonComponent
      type="submit"
      variant="primary"
      size="md"
      fullWidth
      isLoading={pending}
      loadingText="로그인 중..."
      label={label}
    />
  );
}
