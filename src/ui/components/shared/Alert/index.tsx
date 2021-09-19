import React, { useState } from 'react';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RawHTML } from '../RawHTML';

interface AlertProps {
  children?: string;
  error?: any;
  severity?: AlertColor;
  closable?: boolean;
}

export function Alert(props: AlertProps) {
  const { error, severity = 'error', closable } = props;
  const children = props.children || error?.data.error.message;
  const [open, setOpen] = useState(true);

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
              onClick={() => {
                setOpen(false);
              }}
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
