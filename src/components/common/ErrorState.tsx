import Button from './ui/Button';

type ErrorStateProps = {
  title?: string;
  description?: string;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

const ErrorState = ({ title = '문제가 발생했습니다.', description, action, className }: ErrorStateProps) => {
  return (
    <div className={`${className} text-center`}>
      <p className="font-semibold text-gray-900">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
      {action && <Button onClick={action.onClick} className="mt-4" size="sm" variant="primary" label={action.label} />}
    </div>
  );
};

export default ErrorState;
