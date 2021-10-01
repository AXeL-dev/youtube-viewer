import React from 'react';
import { Box, Grid } from '@mui/material';
import { HomeView, Video } from 'types';
import VideoCard from './VideoCard';
import VideoSkeleton from './VideoSkeleton';
import GridItem from './GridItem';
import config from './config';
import LoadMore from './LoadMore';

interface ChannelVideosProps {
  videos: Video[];
  view: HomeView;
  isLoading: boolean;
  itemsPerRow: number;
  maxResults: number;
  hasMore?: boolean;
  onVideoPlay: (video: Video) => void;
  onLoadMore?: () => void;
}

function ChannelVideos(props: ChannelVideosProps) {
  const {
    videos,
    view,
    isLoading,
    itemsPerRow,
    maxResults,
    hasMore,
    onVideoPlay,
    onLoadMore,
  } = props;
  const skeletonNumber = Math.min(maxResults - videos.length, itemsPerRow);

  return (
    <Box sx={{ display: 'flex', pl: 6 }}>
      <Grid container spacing={config.gridSpacing} columns={config.gridColumns}>
        {videos.map((video: Video, index: number) => (
          <GridItem key={index}>
            <VideoCard video={video} view={view} onVideoPlay={onVideoPlay} />
          </GridItem>
        ))}
        {isLoading && skeletonNumber > 0
          ? Array.from(new Array(skeletonNumber)).map((_, index: number) => (
              <GridItem key={index}>
                <VideoSkeleton />
              </GridItem>
            ))
          : null}
      </Grid>
      <LoadMore isLoading={isLoading} hasMore={hasMore} onClick={onLoadMore} />
    </Box>
  );
}

export default ChannelVideos;
