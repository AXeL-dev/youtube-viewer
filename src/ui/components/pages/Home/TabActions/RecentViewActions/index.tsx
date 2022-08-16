import React from 'react';
import { Box } from '@mui/material';
import RecentViewFilters from './RecentViewFilters';
import RecentVideosSeniority from './RecentVideosSeniority';

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
      <RecentViewFilters />
      <RecentVideosSeniority />
    </Box>
  );
}

export default RecentViewActions;
