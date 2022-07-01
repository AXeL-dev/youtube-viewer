import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  text: string | React.ReactNode;
  onClose: (confirmed?: boolean) => void;
}

function ConfirmationDialogComponent(props: ConfirmationDialogProps) {
  const { open, title, text, onClose } = props;

  const handleConfirm = () => {
    onClose(true);
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogTitle sx={{ px: 0, pt: 0 }}>{title}</DialogTitle>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button variant="text" color="inherit" onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function propsAreEqual(
  prevProps: ConfirmationDialogProps,
  nextProps: ConfirmationDialogProps
) {
  return prevProps.open === nextProps.open;
}

export const ConfirmationDialog = React.memo(
  ConfirmationDialogComponent,
  propsAreEqual
);
