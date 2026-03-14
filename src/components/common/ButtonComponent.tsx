import { ButtonComponentProps } from '@/types/button.type';
import cn from '@/utils/cn';
import React, { forwardRef } from 'react';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-md box-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses: Record<NonNullable<ButtonComponentProps['variant']>, string> = {
  primary: 'bg-[#af5858] text-white hover:bg-[#8f4646]',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-gray-900 hover:bg-gray-100',
  outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
  navbarLight: 'bg-white text-black hover:bg-gray-200',
  navbarDark: 'bg-black text-white hover:bg-gray-800',
};

const sizeClasses: Record<NonNullable<ButtonComponentProps['size']>, string> = {
  xs: 'text-[11px] px-2 py-1 h-7',
  sm: 'text-xs px-3 py-1.5 h-8',
  md: 'text-sm px-4 py-2 h-10',
};

const ButtonSpinner = ({ size = 14 }: { size?: number }) => {
  return (
    <span
      className="inline-block animate-spin rounded-full border-1 border-current/70 border-t-transparent"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
};

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonComponentProps>(
  (
    {
      className,
      label,
      children,
      variant = 'primary',
      size = 'sm',
      type = 'button',
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      disabled,
      loadingText = '처리중...',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const buttonContent = children ?? label;
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading ? true : undefined}
        className={cn(base, variantClasses[variant], sizeClasses[size], fullWidth && 'w-full', className)}
        {...props}
      >
        {isLoading ? (
          <span className="text-center flex items-center">
            <ButtonSpinner />
            <span className="leading-none">{loadingText}</span>
          </span>
        ) : (
          <>
            {leftIcon ? <span className="pointer-events-none">{leftIcon}</span> : null}
            <span className="leading-none">
              {buttonContent != null && <span className="leading-none">{buttonContent}</span>}
            </span>
            {rightIcon ? <span className="pointer-events-none">{rightIcon}</span> : null}
          </>
        )}
      </button>
    );
  }
);

ButtonComponent.displayName = 'ButtonComponent';
export default ButtonComponent;
