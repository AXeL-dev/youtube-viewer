import React from 'react';
import { Box } from '@mui/material';
import RecentViewOptions from './RecentViewOptions';

interface RecentViewActionsProps {}

function RecentViewActions(props: RecentViewActionsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <RecentViewOptions />
    </Box>
  );
}

export default RecentViewActions;
