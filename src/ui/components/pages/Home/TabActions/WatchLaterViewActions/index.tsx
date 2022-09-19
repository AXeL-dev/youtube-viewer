import React from 'react';
import { Box } from '@mui/material';
import WatchLaterViewFilters from './WatchLaterViewFilters';
import WatchLaterViewOptions from './WatchLaterViewOptions';
import WatchLaterViewSorting from './WatchLaterViewSorting';

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
      <WatchLaterViewSorting />
      <WatchLaterViewFilters />
      {videosCount > 0 ? (
        <WatchLaterViewOptions videosCount={videosCount} />
      ) : null}
    </Box>
  );
}

export default WatchLaterViewActions;
