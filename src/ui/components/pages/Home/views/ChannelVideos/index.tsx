import React from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import { HomeView, Video } from 'types';
import VideoCard from './VideoCard';
import VideoSkeleton from './VideoSkeleton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import GridItem from './GridItem';
import config from './config';

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
      {hasMore ? (
        <IconButton
          sx={{ ml: 2, borderRadius: 0 }}
          disabled={isLoading}
          size="small"
          onClick={onLoadMore}
        >
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
      ) : null}
    </Box>
  );
}

export default React.memo(ChannelVideos);
