import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import { RawHTML } from 'components';

interface ImportDialogProps {
  open: boolean;
  title: string;
  description: string;
  textFieldId: string;
  textFieldLabel: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onClose: Function;
  onConfirm: Function;
  onValidate: Function;
}

export function ImportDialog(props: ImportDialogProps) {
  const { open, title, description, textFieldId, textFieldLabel, confirmButtonText = 'Import', cancelButtonText = 'Cancel', onClose, onConfirm, onValidate } = props;
  const [textFieldError, setTextFieldError] = React.useState(false);

  const confirm = () => {
    try {
      const json = (document.getElementById(textFieldId) as any).value;
      const data = JSON.parse(json);
      const isValid = onValidate(data);
      setTextFieldError(!isValid); // == false when isValid is true & vice versa
      if (isValid) {
        onConfirm(data);
      }
    } catch(error) {
      setTextFieldError(true);
    }
  };

  const close = () => {
    setTextFieldError(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <RawHTML>{description}</RawHTML>
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id={textFieldId}
          label={textFieldLabel}
          error={textFieldError}
          multiline
          rows="10"
          variant="outlined"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          {cancelButtonText}
        </Button>
        <Button onClick={confirm} color="primary" autoFocus>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
