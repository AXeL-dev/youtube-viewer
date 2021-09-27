import React, { MouseEvent } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CloseButtonProps {
  onClick: (event: MouseEvent) => void;
}

export default function CloseButton(props: CloseButtonProps) {
  const { onClick } = props;

  return (
    <IconButton
      sx={{
        position: 'absolute',
        top: (theme) => theme.spacing(-1.75),
        right: (theme) => theme.spacing(-1.75),
        bgcolor: 'primary.main',
        color: 'common.white',
        fontSize: '1.275rem',
        '&:hover': {
          bgcolor: 'primary.main',
          color: 'common.white',
        },
      }}
      size="small"
      onClick={onClick}
    >
      <CloseIcon fontSize="inherit" />
    </IconButton>
  );
}
