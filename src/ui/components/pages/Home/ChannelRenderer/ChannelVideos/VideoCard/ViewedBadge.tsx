import React from 'react';
import { Box, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Video } from 'types';
import { useAppSelector } from 'store';
import { selectVideoMeta } from 'store/selectors/videos';

interface ViewedBadgeProps {
  video: Video;
}

function ViewedBadge(props: ViewedBadgeProps) {
  const { video } = props;
  const { isViewed } = useAppSelector(selectVideoMeta(video));

  return isViewed ? (
    <Tooltip title="Viewed" aria-label="viewed">
      <Box
        sx={{
          display: 'flex',
          position: 'absolute',
          bottom: 0,
          left: 0,
          margin: '4px',
          color: '#eee',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '3px 5px',
          borderRadius: '2px',
          '&:hover': {
            color: '#fff',
          },
        }}
      >
        <VisibilityIcon sx={{ fontSize: '1rem' }} />
      </Box>
    </Tooltip>
  ) : null;
}

function propsAreEqual(
  prevProps: ViewedBadgeProps,
  nextProps: ViewedBadgeProps
) {
  return prevProps.video.id === nextProps.video.id;
}

export default React.memo(ViewedBadge, propsAreEqual);
