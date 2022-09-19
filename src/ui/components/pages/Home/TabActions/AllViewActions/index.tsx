import React from 'react';
import { Box } from '@mui/material';
import { HomeView } from 'types';
import ViewSorting from '../ViewSorting';

interface AllViewActionsProps {}

function AllViewActions(props: AllViewActionsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <ViewSorting view={HomeView.All} />
    </Box>
  );
}

export default AllViewActions;
