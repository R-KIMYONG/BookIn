'use client';

import { useFormStatus } from 'react-dom';
import ButtonComponent from '@/components/common/ui/ButtonComponent';

type SubmitButtonProps = {
  label: string;
};

const SubmitButton = ({ label }: SubmitButtonProps) => {
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
};
export default SubmitButton;
