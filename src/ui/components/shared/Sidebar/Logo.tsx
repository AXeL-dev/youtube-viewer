import React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const { REACT_APP_NAME, REACT_APP_VERSION } = process.env;

interface LogoProps {
  showVersion?: boolean;
}

export default function Logo(props: LogoProps) {
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
        '& > img': {
          width: 32,
          height: 32,
          filter: 'contrast(150%) brightness(100%)',
        },
      }}
    >
      <img alt="logo" src="icons/128.png" />
      <Box
        component="span"
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <Typography variant="subtitle1">{REACT_APP_NAME}</Typography>
        {showVersion && (
          <Typography
            variant="caption"
            sx={{
              marginLeft: 1,
              backgroundColor: '#eee',
              padding: '3px 6px',
              border: '1px solid #e8e8e8',
              borderRadius: '4px',
              color: 'rgba(0, 0, 0, 0.7)',
              fontSize: '0.75rem',
              lineHeight: 1,
            }}
          >
            v{REACT_APP_VERSION}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
