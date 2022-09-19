import React from 'react';
import { Box } from '@mui/material';
import AllViewOptions from './AllViewOptions';

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
      <AllViewOptions />
    </Box>
  );
}

export default AllViewActions;
