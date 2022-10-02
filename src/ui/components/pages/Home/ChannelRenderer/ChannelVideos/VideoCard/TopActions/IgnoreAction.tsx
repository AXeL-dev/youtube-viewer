import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import DoNotDisturbOffIcon from '@mui/icons-material/DoNotDisturbOff';
import { HomeView, Video } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import { addVideoFlag, removeVideoFlag } from 'store/reducers/videos';
import { selectVideoFlag } from 'store/selectors/videos';

interface IgnoreActionProps {
  video: Video;
  view: HomeView;
}

const flag = 'ignored';

function IgnoreAction(props: IgnoreActionProps) {
  const { video, view } = props;
  const isIgnored = useAppSelector(selectVideoFlag(video, flag));
  const dispatch = useAppDispatch();

  if (view !== HomeView.Recent) {
    return null;
  }

  return isIgnored ? (
    <Tooltip title="Unignore" aria-label="unignore">
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
            removeVideoFlag({
              video,
              flag,
            }),
          );
        }}
      >
        <DoNotDisturbOffIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Ignore" aria-label="ignore">
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
            addVideoFlag({
              video,
              flag,
            }),
          );
        }}
      >
        <DoDisturbOnIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  );
}

export default IgnoreAction;
