import React from 'react';
import { IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface DragHandleProps {}

export default function DragHandle(props: DragHandleProps) {
  return (
    <IconButton
      sx={{ cursor: 'move', mr: 1.5 }}
      aria-label="drag-handle"
      {...props}
    >
      <DragIndicatorIcon />
    </IconButton>
  );
}
