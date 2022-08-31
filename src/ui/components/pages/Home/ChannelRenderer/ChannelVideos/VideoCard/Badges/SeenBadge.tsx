import React from 'react';
import { Box, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Video } from 'types';
import { useAppSelector } from 'store';
import { selectVideoMeta } from 'store/selectors/videos';

interface SeenBadgeProps {
  video: Video;
}

function SeenBadge(props: SeenBadgeProps) {
  const { video } = props;
  const { isSeen } = useAppSelector(selectVideoMeta(video));

  return isSeen ? (
    <Tooltip title="Seen" aria-label="seen">
      <Box
        sx={{
          display: 'flex',
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

export default SeenBadge;
