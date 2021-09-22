import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Channel } from 'types';
import ChannelPicture from '../ChannelPicture';

interface RemoveChannelDialogProps {
  open: boolean;
  channel: Channel;
  onClose: (confirmed?: boolean) => void;
}

export default function RemoveChannelDialog(props: RemoveChannelDialogProps) {
  const { open, channel, onClose } = props;

  const handleConfirm = () => {
    onClose(true);
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box sx={{ display: 'flex' }}>
          <ChannelPicture channel={channel} />
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              px: 2,
            }}
          >
            <DialogTitle sx={{ px: 0, pt: 0 }}>
              Remove {channel.title}'s channel ?
            </DialogTitle>
            <DialogContentText>
              Are you sure that you want to remove this channel?
            </DialogContentText>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button color="inherit" onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}