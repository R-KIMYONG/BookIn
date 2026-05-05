import ButtonComponent from './ui/ButtonComponent';

type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

const ErrorState = ({ title = '문제가 발생했습니다.', description, action }: ErrorStateProps) => {
  return (
    <div className="text-center">
      <p className="font-semibold text-gray-900">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
      {action && (
        <ButtonComponent onClick={action.onClick} className="mt-4" size="sm" variant="primary" label={action.label} />
      )}
    </div>
  );
};

export default ErrorState;
