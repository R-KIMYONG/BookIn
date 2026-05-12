'use client';

import { useFormStatus } from 'react-dom';
import Button from '@/components/common/ui/Button';

type SubmitButtonProps = {
  label: string;
};

const SubmitButton = ({ label }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
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
