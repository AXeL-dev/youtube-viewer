import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface LoadMoreProps {
  isLoading: boolean;
  onClick?: () => void;
}

export default function LoadMore(props: LoadMoreProps) {
  const { isLoading, onClick } = props;
  const [loadMoreHits, setLoadMoreHits] = useState(0);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setLoadMoreHits(loadMoreHits + 1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ml: 2,
      }}
    >
      {Array.from(new Array(loadMoreHits)).map((_, index: number) => (
        <Box sx={{ flexGrow: 1, flexBasis: 0 }} key={index}></Box>
      ))}
      <IconButton
        sx={{ flexGrow: 1, flexBasis: 0, borderRadius: 0, py: 0 }}
        disabled={isLoading}
        size="small"
        onClick={handleClick}
      >
        <ArrowForwardIosIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
