'use client';

type LoadingProps = {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
};

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

const Loading = ({ size = 'md', text }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`animate-spin rounded-full border-current border-t-transparent ${sizeMap[size]}`} />
      {text && <p className="text-xs text-gray-500 tracking-wide">{text}</p>}
    </div>
  );
};

export default Loading;
