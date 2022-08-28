import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import DoNotDisturbOffIcon from '@mui/icons-material/DoNotDisturbOff';
import { HomeView, Video } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import { addVideoFlag, removeVideoFlag } from 'store/reducers/videos';
import { selectVideoMeta } from 'store/selectors/videos';

interface IgnoredActionProps {
  video: Video;
  view: HomeView;
}

function IgnoredAction(props: IgnoredActionProps) {
  const { video, view } = props;
  const { isIgnored } = useAppSelector(selectVideoMeta(video));
  const dispatch = useAppDispatch();

  return view === HomeView.Recent ? (
    isIgnored ? (
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
                flag: 'ignored',
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
                flag: 'ignored',
              }),
            );
          }}
        >
          <DoDisturbOnIcon sx={{ fontSize: '1.125rem' }} />
        </IconButton>
      </Tooltip>
    )
  ) : null;
}

export default IgnoredAction;
