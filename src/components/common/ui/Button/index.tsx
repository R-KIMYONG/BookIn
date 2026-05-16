import { ButtonProps } from '@/components/common/ui/Button/type';
import cn from '@/shared/utils/cn';
import React, { forwardRef } from 'react';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl box-border transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed';

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[#af5858] text-white hover:bg-[#8f4646]',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-gray-900 hover:bg-gray-100',
  outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
  navbarLight: 'bg-white text-black hover:bg-gray-200',
  navbarDark: 'bg-black text-white hover:bg-gray-800',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  xs: 'text-[11px] px-2 py-1 h-7',
  sm: 'text-xs px-3 py-1.5 h-8',
  md: 'text-sm px-4 py-2 h-10',
};

export const ButtonSpinner = () => {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-[blink_1.4s_infinite]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-[blink_1.4s_0.2s_infinite]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-[blink_1.4s_0.4s_infinite]" />
    </span>
  );
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
    const hasLoadingText = loadingText.trim() !== '';
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
          <span className={cn('flex items-center justify-center', hasLoadingText && 'gap-2')}>
            <ButtonSpinner />
            {hasLoadingText && <span className="leading-none">{loadingText}</span>}
          </span>
        ) : (
          <>
            {leftIcon ? <span className="pointer-events-none">{leftIcon}</span> : null}

            {buttonContent != null && <span className="leading-none">{buttonContent}</span>}

            {rightIcon ? <span className="pointer-events-none">{rightIcon}</span> : null}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
