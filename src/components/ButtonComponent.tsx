import { ButtonType } from '@/types/button.type';
import React, { forwardRef } from 'react';

type Props = ButtonType & React.ComponentPropsWithoutRef<'button'>;

const ButtonComponent = forwardRef<HTMLButtonElement, Props>(({ style, label, onClick, ...props }, ref) => {
  return (
    <button ref={ref} type="button" className={style} onClick={onClick} {...props}>
      {label}
    </button>
  );
});

ButtonComponent.displayName = 'ButtonComponent';
export default ButtonComponent;
