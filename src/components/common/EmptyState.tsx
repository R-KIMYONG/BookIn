import Link from 'next/link';
import Button from './ui/Button';

type EmptyStateProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  href?: string;
  buttonLabel?: string;
  className?: string;
  showButton?: boolean;
};

const EmptyState = ({
  icon,
  title = '데이터가 없습니다.',
  description,
  href = '/',
  className,
  buttonLabel = '홈으로',
  showButton = true,
}: EmptyStateProps) => {
  return (
    <div className={`${className} flex justify-center items-center min-h-full`}>
      <div className="text-center">
        {icon && <div className="flex justify-center mb-3">{icon}</div>}
        <p className="font-semibold text-gray-900">{title}</p>
        {description ? <p className="mt-2 text-sm text-gray-500 whitespace-pre-line">{description}</p> : null}
        {showButton && (
          <Link href={href}>
            <Button label={buttonLabel} variant="primary" size="sm" type="button" className="!mt-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
