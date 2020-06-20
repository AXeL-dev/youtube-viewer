import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  onClose: Function;
  onRefresh: Function;
}

export function CustomSnackbar(props: CustomSnackbarProps) {
  const { open, message, onClose, onRefresh } = props;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={() => onClose()}
      message={message}
      action={
        <React.Fragment>
          <Button color="secondary" size="small" onClick={(event) => onRefresh(null, event)}>
            Refresh
          </Button>
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => onClose()}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  )
}
