import React from 'react';
import { Box } from '@mui/material';
import AllViewSorting from './AllViewSorting';

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
      <AllViewSorting />
    </Box>
  );
}

export default AllViewActions;
