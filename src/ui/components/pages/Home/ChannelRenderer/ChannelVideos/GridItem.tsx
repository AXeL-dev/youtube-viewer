import React from 'react';
import { Grid, GridProps } from '@mui/material';

interface GridItemProps extends GridProps {}

export default function GridItem(props: GridItemProps) {
  const { children, ...rest } = props;

  return (
    <Grid item xs={1} sm={1} md={1} lg={1} xl={1} {...rest}>
      {children}
    </Grid>
  );
}
