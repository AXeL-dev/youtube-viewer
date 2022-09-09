import React from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import { Sidebar } from 'ui/components/shared';

interface LayoutProps {
  children?: React.ReactNode;
  sx?: SxProps;
}

export function Layout(props: LayoutProps) {
  const { children, sx } = props;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <Sidebar />
      <Box
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ...sx }}
      >
        <div id="layout-content-portal"></div>
        {children}
      </Box>
    </Box>
  );
}
