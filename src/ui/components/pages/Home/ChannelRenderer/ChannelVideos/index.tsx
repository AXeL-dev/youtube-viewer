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
  isLoading: boolean;
  maxResults: number;
  view: HomeView;
  hasMore?: boolean;
  onVideoPlay: (video: Video) => void;
  onLoadMore?: () => void;
}

function ChannelVideos(props: ChannelVideosProps) {
  const {
    videos,
    isLoading,
    maxResults,
    view,
    hasMore,
    onVideoPlay,
    onLoadMore,
  } = props;
  const skeletonNumber = maxResults - videos.length;

  return (
    <Box sx={{ display: 'flex', pl: 6 }}>
      <Grid container spacing={config.gridSpacing} columns={config.gridColumns}>
        {videos.map((video: Video, index: number) => (
          <GridItem key={index}>
            <VideoCard video={video} view={view} onVideoPlay={onVideoPlay} />
          </GridItem>
        ))}
        {isLoading
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

export default React.memo(ChannelVideos);
