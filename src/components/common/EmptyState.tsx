import Link from 'next/link';
import ButtonComponent from './ui/ButtonComponent';

type EmptyStateProps = {
  title?: string;
  description?: string;
  href?: string;
  buttonLabel?: string;
};

const EmptyState = ({
  title = '데이터가 없습니다.',
  description,
  href = '/',
  buttonLabel = '홈으로',
}: EmptyStateProps) => {
  return (
    <div className="flex justify-center items-center min-h-full">
      <div className="text-center">
        <p className="font-semibold text-gray-900">{title}</p>
        {description ? <p className="mt-2 text-sm text-gray-500 whitespace-pre-line">{description}</p> : null}
        <Link href={href}>
          <ButtonComponent label={buttonLabel} variant="primary" size="sm" type="button" className="!mt-4" />
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
