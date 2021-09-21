import React from 'react';
import { Skeleton, Box } from '@mui/material';

interface VideoSkeletonProps {
  width?: string | number;
  height?: string | number;
}

export default function VideoSkeleton(props: VideoSkeletonProps) {
  const { width = '100%', height = 120 } = props;

  return (
    <>
      <Skeleton variant="rectangular" width={width} height={height} />
      <Box pt={0.5}>
        <Skeleton />
        <Skeleton width="60%" />
      </Box>
    </>
  );
}
