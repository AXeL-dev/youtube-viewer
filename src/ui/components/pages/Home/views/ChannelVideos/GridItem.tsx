import React from 'react';
import { Grid } from '@mui/material';

interface GridItemProps {
  children: React.ReactNode;
}

export default function GridItem(props: GridItemProps) {
  const { children } = props;

  return (
    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
      {children}
    </Grid>
  );
}
