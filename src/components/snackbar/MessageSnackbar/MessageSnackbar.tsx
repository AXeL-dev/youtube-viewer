import React from 'react';
import { Snackbar, Button } from '@material-ui/core';
import { RawHTML } from 'components';

interface MessageSnackbarProps {
  message: string|undefined;
  open: boolean;
  onClose: Function;
  autoHideDuration?: number;
  anchorOrigin?: any;
}

export function MessageSnackbar(props: MessageSnackbarProps) {
  const { message, open, onClose, autoHideDuration = 6000, anchorOrigin = { vertical: 'top', horizontal: 'center' } } = props;

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={() => onClose()}
      message={message && <RawHTML>{message}</RawHTML>}
      action={
        <Button color="secondary" size="small" onClick={() => onClose()}>
          Close
        </Button>
      }
    />
  )
}
