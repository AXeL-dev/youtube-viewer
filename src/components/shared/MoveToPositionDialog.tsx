import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { isNumber } from '../../helpers/parser';

interface MoveToPositionDialogProps {
  open: boolean;
  title: string;
  min?: number;
  max?: number;
  step?: number;
  positionFieldId: string;
  positionFieldLabel: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onClose: Function;
  onConfirm: Function;
}

export function MoveToPositionDialog(props: MoveToPositionDialogProps) {
  const { open, title, min = 0, max = 100, step = 1, positionFieldId, positionFieldLabel, confirmButtonText = 'Move', cancelButtonText = 'Cancel', onClose, onConfirm } = props;
  const [positionFieldError, setPositionFieldError] = React.useState(false);

  const confirm = () => {
    const position = (document.getElementById(positionFieldId) as any).value;
    const isValid = isNumber(position);
    setPositionFieldError(!isValid); // == false when isValid is true & vise versa
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
      <DialogContent>
        <TextField
          autoFocus
          id={positionFieldId}
          label={positionFieldLabel}
          error={positionFieldError}
          inputProps={{ min: min, max: max, step: step }}
          defaultValue={min}
          type="number"
          size="small"
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
