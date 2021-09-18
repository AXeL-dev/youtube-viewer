import * as React from 'react';
import Box from '@mui/material/Box';
import { LinearProgressProps } from '@mui/material/LinearProgress';
import LinearProgress from './LinearProgress';

export function ProgressBar(props: LinearProgressProps) {
  const { variant = 'determinate', value = 0 } = props;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <LinearProgress variant={variant} value={value} />
    </Box>
  );
}
