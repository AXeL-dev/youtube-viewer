import React from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from 'store';
import { selectWatchLaterVideosCount } from 'store/selectors/videos';
import WatchLaterViewOptions from './WatchLaterViewOptions';

interface WatchLaterViewActionsProps {}

function WatchLaterViewActions(props: WatchLaterViewActionsProps) {
  const watchLaterVideosCount = useAppSelector(selectWatchLaterVideosCount);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <WatchLaterViewOptions videosCount={watchLaterVideosCount} />
    </Box>
  );
}

export default WatchLaterViewActions;
