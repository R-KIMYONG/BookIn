import React from 'react';
import { resetTempSession } from '@/app/actions/auth.actions';
import ButtonComponent from '../../common/ButtonComponent';

const ExtendButton = React.memo(() => {
  return (
    <form action={resetTempSession}>
      <ButtonComponent type="submit" size="xs" variant="secondary" label="연장" />
    </form>
  );
});

ExtendButton.displayName = 'ExtendButton';
export default ExtendButton;
