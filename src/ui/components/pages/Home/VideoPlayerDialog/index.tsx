import React, { MouseEvent } from 'react';
import YouTube, { PlayerVars } from 'react-youtube';
import { Dialog, DialogContent } from '@mui/material';
import { Video, Nullable } from 'types';
import { noop } from 'helpers/utils';
import { useAppSelector } from 'store';
import { selectSettings } from 'store/selectors/settings';
import CloseButton from './CloseButton';

interface VideoPlayerDialogProps {
  open: boolean;
  video: Nullable<Video>;
  onClose: () => void;
}

function VideoPlayerDialog(props: VideoPlayerDialogProps) {
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
      <CloseButton onClick={handleClose} />
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

function propsAreEqual(
  prevProps: VideoPlayerDialogProps,
  nextProps: VideoPlayerDialogProps,
) {
  return (
    prevProps.open === nextProps.open &&
    prevProps.video?.id === nextProps.video?.id
  );
}

export default React.memo(VideoPlayerDialog, propsAreEqual);
