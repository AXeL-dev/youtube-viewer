import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { Channel } from 'types';
import ChannelPicture from '../ChannelPicture';

interface RemoveChannelDialogProps {
  open: boolean;
  channel: Channel;
  onClose: (confirmed?: boolean, shouldRemoveVideos?: boolean) => void;
}

export default function RemoveChannelDialog(props: RemoveChannelDialogProps) {
  const { open, channel, onClose } = props;
  const [shouldRemoveVideos, setShouldRemoveVideos] = useState(false);

  const handleConfirm = () => {
    onClose(true, shouldRemoveVideos);
  };

  const handleClose = () => {
    onClose(false);
  };

  const handleRemoveVideosToggle = () => {
    setShouldRemoveVideos(!shouldRemoveVideos);
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
            <FormGroup sx={{ pt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shouldRemoveVideos}
                    size="small"
                    onClick={handleRemoveVideosToggle}
                  />
                }
                label="Remove the channel videos as well?"
              />
            </FormGroup>
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
