import React from 'react';
import { Box } from '@mui/material';
import MuiTab, { TabProps as MuiTabProps } from '@mui/material/Tab';
import Badge from './Badge';

interface TabProps extends MuiTabProps {
  badge?: React.ReactNode;
  selected?: boolean;
}

export default function Tab(props: TabProps) {
  const { label, badge, selected, ...rest } = props;

  return (
    <MuiTab
      sx={{
        fontSize: '0.975rem',
        fontWeight: 400,
        minWidth: 140,
        textTransform: 'capitalize',
      }}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {label}
          {badge && selected ? <Badge badgeContent={badge} /> : null}
        </Box>
      }
      disableRipple
      {...rest}
    />
  );
}
