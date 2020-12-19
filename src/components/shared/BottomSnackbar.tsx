import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

interface BottomSnackbarProps {
  open: boolean;
  snackbarKey?: number; // used when displaying multiple consecutive snackbars
  message: string;
  onClose: Function;
  onRefresh: Function;
  autoHideDuration?: number;
  showRefreshButton?: boolean
}

export function BottomSnackbar(props: BottomSnackbarProps) {
  const { open, snackbarKey, message, onClose, onRefresh, autoHideDuration = 6000, showRefreshButton = true } = props;

  const handleClose = (event: React.SyntheticEvent | MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      key={snackbarKey}
      open={open}
      autoHideDuration={autoHideDuration}
      TransitionComponent={SlideTransition}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          {showRefreshButton && <Button color="secondary" size="small" onClick={(event) => onRefresh(null, event)}>
            Refresh
          </Button>}
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  )
}
