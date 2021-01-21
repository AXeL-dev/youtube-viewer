import React from 'react';
import { Snackbar, Button, IconButton, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { TransitionProps } from '@material-ui/core/transitions';
import { Alert } from '@material-ui/lab';
import { SnackbarIcon } from 'models';
import { useStyles } from './styles';

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

interface BottomSnackbarProps {
  open: boolean;
  snackbarKey?: string|number; // used when displaying multiple consecutive snackbars
  message: string;
  icon?: SnackbarIcon,
  onClose: Function;
  onRefresh: Function;
  autoHideDuration?: number;
  showRefreshButton?: boolean
}

export function BottomSnackbar(props: BottomSnackbarProps) {
  const { open, snackbarKey, message, icon, onClose, onRefresh, autoHideDuration = 6000, showRefreshButton = true } = props;
  const classes = useStyles();

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
    >
      <Alert
        severity={icon}
        className={classes.alert}
        variant="filled"
        onClose={handleClose}
        action={
          <React.Fragment>
            {showRefreshButton && (
              <Button color="secondary" size="small" onClick={(event) => onRefresh(null, event)}>
                Refresh
              </Button>
            )}
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
