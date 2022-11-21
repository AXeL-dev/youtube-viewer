import React from 'react';
import { Skeleton, Box } from '@mui/material';

interface VideoSkeletonProps {
  width?: string | number;
  height?: string | number;
}

export default function VideoSkeleton(props: VideoSkeletonProps) {
  const { width = '100%', height = 120 } = props;

  return (
    <Box height={220}>
      <Skeleton variant="rectangular" width={width} height={height} />
      <Box pt={0.75}>
        <Skeleton height={20} />
        <Skeleton height={20} width="60%" />
      </Box>
      <Box pt={1}>
        <Skeleton height={14} width="40%" style={{ marginBottom: 6 }} />
        <Skeleton height={14} width="60%" />
      </Box>
    </Box>
  );
}
