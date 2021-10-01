import React, { useState, useEffect } from 'react';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AlertProps {
  open?: boolean;
  children?: React.ReactNode;
  error?: any;
  severity?: AlertColor;
  closable?: boolean;
  syncOpen?: boolean;
  onClose?: () => void;
}

export function Alert(props: AlertProps) {
  const {
    open: openProp = true,
    error,
    severity = 'error',
    closable,
    syncOpen,
    onClose,
  } = props;
  const children = props.children || error?.data?.error.message || error?.error;
  const [open, setOpen] = useState(openProp);

  useEffect(() => {
    if (syncOpen && openProp !== open) {
      setOpen(openProp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openProp, syncOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Collapse in={open}>
      <MuiAlert
        sx={{ borderRadius: 'unset' }}
        severity={severity}
        action={
          closable ? (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          ) : null
        }
      >
        {children}
      </MuiAlert>
    </Collapse>
  );
}
