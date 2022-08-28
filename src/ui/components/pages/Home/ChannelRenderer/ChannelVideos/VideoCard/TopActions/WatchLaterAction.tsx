import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { HomeView, Video } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import { addVideoFlag, removeVideoFlag } from 'store/reducers/videos';
import { selectVideoMeta } from 'store/selectors/videos';

interface WatchLaterActionProps {
  video: Video;
  view: HomeView;
}

function WatchLaterAction(props: WatchLaterActionProps) {
  const { video, view } = props;
  const { isToWatchLater } = useAppSelector(selectVideoMeta(video));
  const dispatch = useAppDispatch();

  return !isToWatchLater ? (
    <Tooltip title="Watch later" aria-label="watch-later">
      <IconButton
        sx={{
          display: 'flex',
          color: '#eee',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '4px',
          borderRadius: '2px',
          '&:hover': {
            color: '#fff',
          },
        }}
        size="small"
        onClick={() => {
          dispatch(
            addVideoFlag({
              video,
              flag: 'toWatchLater',
            }),
          );
        }}
      >
        <WatchLaterOutlinedIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  ) : view === HomeView.WatchLater ? (
    <Tooltip title="Remove" aria-label="remove-from-watch-later">
      <IconButton
        sx={{
          color: '#eee',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '4px',
          borderRadius: '2px',
          '&:hover': {
            color: '#fff',
          },
        }}
        size="small"
        onClick={() => {
          dispatch(
            removeVideoFlag({
              video,
              flag: 'toWatchLater',
            }),
          );
        }}
      >
        <CloseIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  ) : null;
}

export default WatchLaterAction;
