import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { Channel, HomeView, Video } from 'types';
import ChannelTitle from './ChannelTitle';
import VideoCard from './VideoCard';
import VideoSkeleton from './VideoSkeleton';
import { useChannelVideos } from 'hooks';
import { getDateBefore } from 'helpers/utils';
import GridItem from './GridItem';

export interface ChannelGridProps {
  channel: Channel;
  view: HomeView;
  onError?: (error: any) => void;
}

const publishedAfter = getDateBefore(10).toISOString();
const maxResults = 6;

function ChannelGrid(props: ChannelGridProps) {
  const { channel, view, onError } = props;
  const {
    data: videos,
    error,
    isLoading,
  } = useChannelVideos({
    channel,
    view,
    publishedAfter,
    maxResults,
  });
  const hasVideos = isLoading || videos.length > 0;

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return hasVideos ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        pb: 3,
      }}
    >
      <ChannelTitle channel={channel} />
      <Box sx={{ pl: 6 }}>
        <Grid
          container
          spacing={{ xs: 1, md: 2 }}
          columns={{ xs: 1, sm: 2, md: 3, lg: 5, xl: 6 }}
        >
          {isLoading
            ? Array.from(new Array(maxResults)).map((_, index: number) => (
                <GridItem key={index}>
                  <VideoSkeleton />
                </GridItem>
              ))
            : videos.map((video: Video, index: number) => (
                <GridItem key={index}>
                  <VideoCard video={video} view={view} />
                </GridItem>
              ))}
        </Grid>
      </Box>
    </Box>
  ) : null;
}

export default React.memo(ChannelGrid);
