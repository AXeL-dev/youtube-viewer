import React from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';

interface LogoProps {
  size: number;
  sx?: SxProps<Theme>;
}

export function Logo(props: LogoProps) {
  const { size = 32, sx = {} } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        '> img': {
          width: size,
          height: size,
          filter: 'contrast(150%) brightness(100%)',
        },
        ...sx,
      }}
    >
      <img alt="logo" src="icons/128.png" />
    </Box>
  );
}
