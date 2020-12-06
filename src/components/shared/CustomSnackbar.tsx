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
  autoHideDuration?: number;
  showRefreshButton?: boolean
}

export function CustomSnackbar(props: CustomSnackbarProps) {
  const { open, message, onClose, onRefresh, autoHideDuration = 6000, showRefreshButton = true } = props;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={() => onClose()}
      message={message}
      action={
        <React.Fragment>
          {showRefreshButton && <Button color="secondary" size="small" onClick={(event) => onRefresh(null, event)}>
            Refresh
          </Button>}
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => onClose()}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  )
}
