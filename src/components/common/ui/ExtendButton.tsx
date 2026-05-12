import React from 'react';
import { resetTempSession } from '@/app/actions/session.actions';
import Button from './Button';

const ExtendButton = React.memo(() => {
  return (
    <form action={resetTempSession}>
      <Button type="submit" size="xs" variant="ghost" label="연장" />
    </form>
  );
});

ExtendButton.displayName = 'ExtendButton';
export default ExtendButton;
