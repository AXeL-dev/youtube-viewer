import React from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface LoadMoreProps {
  isLoading: boolean;
  hasMore?: boolean;
  onClick?: () => void;
}

export default function LoadMore(props: LoadMoreProps) {
  const { isLoading, hasMore, onClick } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minWidth: (theme) => theme.spacing(3.5),
        ml: 2,
        gap: 2,
      }}
    >
      {hasMore ? (
        <IconButton
          sx={{ height: 220, borderRadius: 0 }}
          disabled={isLoading}
          size="small"
          onClick={onClick}
        >
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
      ) : null}
    </Box>
  );
}
