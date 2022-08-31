import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Video } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import { addVideoFlag, removeVideoFlag } from 'store/reducers/videos';
import { selectVideoMeta } from 'store/selectors/videos';

interface SeenActionProps {
  video: Video;
}

function SeenAction(props: SeenActionProps) {
  const { video } = props;
  const { isSeen } = useAppSelector(selectVideoMeta(video));
  const dispatch = useAppDispatch();

  return !isSeen ? (
    <Tooltip title="Mark as seen" aria-label="mark-as-seen">
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
              flag: 'seen',
            }),
          );
        }}
      >
        <VisibilityIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Mark as unseen" aria-label="mark-as-unseen">
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
              flag: 'seen',
            }),
          );
        }}
      >
        <VisibilityOffIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  );
}

export default SeenAction;
