import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

interface MessageSnackbarProps {
  message: string;
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
      message={message}
      action={
        <Button color="secondary" size="small" onClick={() => onClose()}>
          Close
        </Button>
      }
    />
  )
}
