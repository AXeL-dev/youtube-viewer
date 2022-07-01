import React from 'react';
import { Box } from '@mui/material';
import WatchLaterViewFilters from './WatchLaterViewFilters';
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
      <WatchLaterViewFilters />
      {videosCount > 0 ? (
        <WatchLaterViewOptions videosCount={videosCount} />
      ) : null}
    </Box>
  );
}

export default WatchLaterViewActions;
