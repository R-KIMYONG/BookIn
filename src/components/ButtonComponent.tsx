import { ButtonType } from '@/types/button.type';
import React, { forwardRef } from 'react';

type Props = ButtonType & React.ComponentPropsWithoutRef<'button'>;

const ButtonComponent = forwardRef<HTMLButtonElement, Props>(({ style, label, type = 'button', ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={`font-semibold text-xs px-2 py-1 rounded-md box-border hover:bg-gray-800 transition-colors ${style}`}
      {...props}
    >
      {label}
    </button>
  );
});

ButtonComponent.displayName = 'ButtonComponent';
export default ButtonComponent;
