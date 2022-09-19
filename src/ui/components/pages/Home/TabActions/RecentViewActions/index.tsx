import React from 'react';
import { Box } from '@mui/material';
import RecentViewOptions from './RecentViewOptions';

interface RecentViewActionsProps {
  videosCount: number;
}

function RecentViewActions(props: RecentViewActionsProps) {
  // const { videosCount } = props;

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
