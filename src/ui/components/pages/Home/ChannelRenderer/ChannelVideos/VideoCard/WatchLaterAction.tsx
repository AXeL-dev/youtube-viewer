import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { HomeView, Video } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import {
  addToWatchLaterList,
  removeFromWatchLaterList,
} from 'store/reducers/videos';
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
          position: 'absolute',
          top: 0,
          right: 0,
          margin: '4px',
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
          dispatch(addToWatchLaterList(video));
        }}
      >
        <WatchLaterOutlinedIcon sx={{ fontSize: '1.25rem' }} />
      </IconButton>
    </Tooltip>
  ) : view === HomeView.WatchLater ? (
    <Tooltip title="Remove" aria-label="remove-from-watch-later">
      <IconButton
        sx={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          right: 0,
          margin: '4px',
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
          dispatch(removeFromWatchLaterList(video));
        }}
      >
        <CloseIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  ) : null;
}

function propsAreEqual(
  prevProps: WatchLaterActionProps,
  nextProps: WatchLaterActionProps
) {
  return (
    prevProps.view === nextProps.view &&
    prevProps.video.id === nextProps.video.id
  );
}

export default React.memo(WatchLaterAction, propsAreEqual);
