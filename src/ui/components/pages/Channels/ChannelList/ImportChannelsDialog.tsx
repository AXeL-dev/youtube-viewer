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

interface ImportChannelsDialogProps {
  open: boolean;
  channels: Channel[];
  onClose: (confirmed?: boolean, shouldReplace?: boolean) => void;
}

export default function ImportChannelsDialog(props: ImportChannelsDialogProps) {
  const { open, channels, onClose } = props;
  const channelsCount = channels?.length || 0;

  const handleConfirm = (shouldReplace?: boolean) => {
    onClose(true, shouldReplace);
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 420,
          }}
        >
          <DialogTitle sx={{ px: 0, pt: 0 }}>Import channels</DialogTitle>
          <DialogContentText>
            {channelsCount} channel{channelsCount > 1 ? 's' : ''} will be
            imported. Continue?
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2 }}>
        <Button color="inherit" onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => handleConfirm(true)}
        >
          Replace
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => handleConfirm()}
        >
          Merge
        </Button>
      </DialogActions>
    </Dialog>
  );
}
