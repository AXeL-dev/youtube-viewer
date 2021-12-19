import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Video } from 'types';
import { useAppDispatch, useAppSelector } from 'store';
import { addViewedVideo, removeViewedVideo } from 'store/reducers/videos';
import { selectVideoMeta } from 'store/selectors/videos';

interface ViewedActionProps {
  video: Video;
}

function ViewedAction(props: ViewedActionProps) {
  const { video } = props;
  const { isViewed } = useAppSelector(selectVideoMeta(video));
  const dispatch = useAppDispatch();

  return !isViewed ? (
    <Tooltip title="Mark as viewed" aria-label="mark-as-viewed">
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
          dispatch(addViewedVideo(video));
        }}
      >
        <VisibilityIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Mark as unviewed" aria-label="mark-as-unviewed">
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
          dispatch(removeViewedVideo(video));
        }}
      >
        <VisibilityOffIcon sx={{ fontSize: '1.125rem' }} />
      </IconButton>
    </Tooltip>
  );
}

export default ViewedAction;
