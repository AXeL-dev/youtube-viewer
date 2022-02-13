import React from 'react';
import { Box, Tooltip } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import { HomeView, Video } from 'types';
import { useAppSelector } from 'store';
import { selectVideoMeta } from 'store/selectors/videos';

interface ArchivedBadgeProps {
  video: Video;
  view: HomeView;
}

function ArchivedBadge(props: ArchivedBadgeProps) {
  const { video, view } = props;
  const { isArchived } = useAppSelector(selectVideoMeta(video));

  return view === HomeView.WatchLater && isArchived ? (
    <Tooltip title="Archived" aria-label="archived">
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
        <ArchiveIcon sx={{ fontSize: '1rem' }} />
      </Box>
    </Tooltip>
  ) : null;
}

export default ArchivedBadge;
