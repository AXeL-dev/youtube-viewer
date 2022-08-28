import React from 'react';
import { Box, Tooltip } from '@mui/material';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { HomeView, Video } from 'types';
import { useAppSelector } from 'store';
import { selectVideoMeta } from 'store/selectors/videos';

interface IgnoredBadgeProps {
  video: Video;
  view: HomeView;
}

function IgnoredBadge(props: IgnoredBadgeProps) {
  const { video, view } = props;
  const { isIgnored } = useAppSelector(selectVideoMeta(video));

  return view === HomeView.Recent && isIgnored ? (
    <Tooltip title="Ignored" aria-label="ignored">
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
        <DoDisturbOnIcon sx={{ fontSize: '1rem' }} />
      </Box>
    </Tooltip>
  ) : null;
}

export default IgnoredBadge;
