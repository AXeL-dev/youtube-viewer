import React, { useState } from 'react';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RawHTML } from '../RawHTML';

interface AlertProps {
  open?: boolean;
  children?: string;
  error?: any;
  severity?: AlertColor;
  closable?: boolean;
  onClose?: () => void;
}

export function Alert(props: AlertProps) {
  const {
    open: openProp = true,
    error,
    severity = 'error',
    closable,
    onClose,
  } = props;
  const children = props.children || error?.data.error.message;
  const [open, setOpen] = useState(openProp);

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
        <RawHTML>{children}</RawHTML>
      </MuiAlert>
    </Collapse>
  );
}
