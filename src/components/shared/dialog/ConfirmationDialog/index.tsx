import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { RawHTML } from 'components';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onClose: Function;
  onConfirm: Function;
}

export function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { open, title, description, confirmButtonText = 'Confirm', cancelButtonText = 'Cancel', onClose, onConfirm } = props;

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <RawHTML>{description}</RawHTML>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="primary">
          {cancelButtonText}
        </Button>
        <Button onClick={() => onConfirm()} color="primary" autoFocus>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
