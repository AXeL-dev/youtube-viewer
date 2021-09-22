import React, { MouseEvent } from 'react';
import YouTube, { PlayerVars } from 'react-youtube';
import { Dialog, IconButton, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Video } from 'types';
import { noop } from 'helpers/utils';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';

interface PlayVideoDialogProps {
  open: boolean;
  video: Video | null;
  onClose: () => void;
}

export default function PlayVideoDialog(props: PlayVideoDialogProps) {
  const { open, video, onClose } = props;
  const settings = useAppSelector(selectSettings);
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: settings.autoPlayVideos ? 1 : 0,
    } as PlayerVars,
  };

  const handleClose = (event: MouseEvent, reason?: string) => {
    if (reason === 'backdropClick') {
      return noop(event);
    }
    onClose();
  };

  return (
    <Dialog
      sx={{
        '& .MuiPaper-root': {
          overflow: 'visible',
          width: '80%',
          maxWidth: 1200,
          height: '80%',
        },
      }}
      open={open}
      onClose={handleClose}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: (theme) => theme.spacing(-1.75),
          right: (theme) => theme.spacing(-1.75),
          bgcolor: 'primary.main',
          color: 'common.white',
          fontSize: '1.4rem',
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'common.white',
          },
        }}
        size="small"
        onClick={handleClose}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
      <DialogContent
        sx={{
          display: 'flex',
          p: 2.5,
          '> div': {
            flexGrow: 1,
          },
        }}
      >
        {video ? <YouTube videoId={video.id} opts={opts} /> : null}
      </DialogContent>
    </Dialog>
  );
}
