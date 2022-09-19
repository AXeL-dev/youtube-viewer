import React from 'react';
import { Box } from '@mui/material';
import WatchLaterViewOptions from './WatchLaterViewOptions';

interface WatchLaterViewActionsProps {
  videosCount: number;
}

function WatchLaterViewActions(props: WatchLaterViewActionsProps) {
  const { videosCount } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <WatchLaterViewOptions videosCount={videosCount} />
    </Box>
  );
}

export default WatchLaterViewActions;
