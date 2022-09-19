import React from 'react';
import { Box } from '@mui/material';
import RecentViewFilters from './RecentViewFilters';
import RecentVideosSeniority from './RecentVideosSeniority';
import RecentViewOptions from './RecentViewOptions';
import ViewSorting from '../ViewSorting';
import { HomeView } from 'types';

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
      <ViewSorting view={HomeView.Recent} />
      <RecentViewFilters />
      <RecentVideosSeniority />
      {videosCount > 0 ? <RecentViewOptions /> : null}
    </Box>
  );
}

export default RecentViewActions;
