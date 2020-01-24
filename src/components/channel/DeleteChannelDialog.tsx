import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Channel } from '../../models/Channel';

interface DeleteChannelDialogProps {
  open: boolean;
  channel: Channel | undefined;
  onClose: Function;
  onConfirm: Function;
}

export function DeleteChannelDialog(props: DeleteChannelDialogProps) {
  const { open, channel, onClose, onConfirm } = props;

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Channel</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Would you like to delete <strong>{channel?.title}</strong> channel?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm()} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
