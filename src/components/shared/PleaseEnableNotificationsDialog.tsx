import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { isNumber } from '../../helpers/parser';

interface PleaseEnableNotificationsDialogProps {
  open: boolean;
  title: string;
  step?: number;
  positionFieldId: string;
  positionFieldLabel: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onClose: Function;
  onConfirm: Function;
}

export function PleaseEnableNotificationsDialog(props: PleaseEnableNotificationsDialogProps) {
  const { open, title, positionFieldId, positionFieldLabel, confirmButtonText = 'Confirm', cancelButtonText = 'Cancel', onClose, onConfirm } = props;
  const [positionFieldError, setPositionFieldError] = React.useState(false);

  const confirm = () => {
    const position = (document.getElementById(positionFieldId) as any).value;
    const isValid = isNumber(position);
    setPositionFieldError(!isValid); // == false when isValid is true & vice versa
    if (isValid) {
      onConfirm(+position);
    }
  };

  const close = () => {
    setPositionFieldError(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
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
