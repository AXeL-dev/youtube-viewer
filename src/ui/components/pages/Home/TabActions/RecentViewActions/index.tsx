import React from 'react';
import { Box } from '@mui/material';
import RecentViewFilters from './RecentViewFilters';
import RecentVideosSeniority from './RecentVideosSeniority';
import RecentViewOptions from './RecentViewOptions';
import RecentViewSorting from './RecentViewSorting';

interface RecentViewActionsProps {
  videosCount: number;
}

function RecentViewActions(props: RecentViewActionsProps) {
  const { videosCount } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <RecentViewSorting />
      <RecentViewFilters />
      <RecentVideosSeniority />
      {videosCount > 0 ? <RecentViewOptions /> : null}
    </Box>
  );
}

export default RecentViewActions;
