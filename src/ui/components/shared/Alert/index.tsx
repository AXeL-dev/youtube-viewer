import React, { useState } from 'react';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { RawHTML } from '../RawHTML';

interface AlertProps {
  children: string;
  severity?: AlertColor;
  closable?: boolean;
}

export function Alert(props: AlertProps) {
  const { children, severity = 'error', closable } = props;
  const [open, setOpen] = useState(true);

  return (
    <Collapse in={open}>
      <MuiAlert
        sx={{ borderRadius: 'unset' }}
        severity={severity}
        action={
          closable && (
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
          )
        }
      >
        <RawHTML>{children}</RawHTML>
      </MuiAlert>
    </Collapse>
  );
}
