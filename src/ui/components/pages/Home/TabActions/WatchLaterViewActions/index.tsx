import React from 'react';
import { Box } from '@mui/material';
import WatchLaterViewFilters from './WatchLaterViewFilters';
import WatchLaterViewOptions from './WatchLaterViewOptions';

interface WatchLaterViewActionsProps {}

function WatchLaterViewActions(props: WatchLaterViewActionsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <WatchLaterViewFilters />
      <WatchLaterViewOptions />
    </Box>
  );
}

export default WatchLaterViewActions;
