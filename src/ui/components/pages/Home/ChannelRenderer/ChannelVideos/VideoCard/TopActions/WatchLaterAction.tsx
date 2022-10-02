import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { HomeView, Video } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import { addVideoFlag, removeVideoFlag } from 'store/reducers/videos';
import { selectVideoFlag } from 'store/selectors/videos';
import { selectHasHiddenView } from 'store/selectors/settings';

interface WatchLaterActionProps {
  video: Video;
  view: HomeView;
}

const flag = 'toWatchLater';

function WatchLaterAction(props: WatchLaterActionProps) {
  const { video, view } = props;
  const isToWatchLater = useAppSelector(selectVideoFlag(video, flag));
  const isWatchLaterViewHidden = useAppSelector(
    selectHasHiddenView(HomeView.WatchLater),
  );
  const dispatch = useAppDispatch();

  if (isWatchLaterViewHidden) {
    return null;
  }

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
              flag,
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
              flag,
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
