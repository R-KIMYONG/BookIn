import React from 'react';
import ButtonComponent from '../../common/ButtonComponent';
import { resetTempSession } from '@/app/actions/session.actions';

const ExtendButton = React.memo(() => {
  return (
    <form action={resetTempSession}>
      <ButtonComponent type="submit" size="xs" variant="ghost" label="연장" />
    </form>
  );
});

ExtendButton.displayName = 'ExtendButton';
export default ExtendButton;
