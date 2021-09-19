import React from 'react';
import { Box, Typography } from '@mui/material';
import { Logo } from 'ui/components/shared';

const { REACT_APP_NAME, REACT_APP_VERSION } = process.env;

interface HeaderProps {
  showVersion?: boolean;
}

export default function Header(props: HeaderProps) {
  const { showVersion } = props;

  return (
    <Box
      component="span"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <Logo size={32} />
      <Box
        component="span"
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary',
        }}
      >
        <Typography variant="subtitle1">{REACT_APP_NAME}</Typography>
        {showVersion ? (
          <Typography
            variant="caption"
            sx={{
              marginLeft: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? '#eee' : 'transparent',
              padding: '3px 6px',
              border: 1,
              borderColor: (theme) =>
                theme.palette.mode === 'light' ? 'transparent' : 'divider',
              borderRadius: '4px',
              color: 'text.primary',
              fontSize: '0.75rem',
              lineHeight: 1,
            }}
          >
            v{REACT_APP_VERSION}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}
