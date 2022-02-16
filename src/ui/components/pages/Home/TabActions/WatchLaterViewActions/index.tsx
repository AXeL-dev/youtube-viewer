import React from 'react';
import { Box } from '@mui/material';
import WatchLaterViewFilters from './WatchLaterViewFilters';
import WatchLaterViewOptions from './WatchLaterViewOptions';

interface WatchLaterViewActionsProps {
  hasVideos: boolean;
}

function WatchLaterViewActions(props: WatchLaterViewActionsProps) {
  const { hasVideos } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <WatchLaterViewFilters />
      {hasVideos ? <WatchLaterViewOptions /> : null}
    </Box>
  );
}

export default WatchLaterViewActions;
