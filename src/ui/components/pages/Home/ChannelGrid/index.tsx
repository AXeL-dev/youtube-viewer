import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { Channel, Video } from 'types';
import ChannelTitle from './ChannelTitle';
import VideoCard from './VideoCard';
import VideoSkeleton from './VideoSkeleton';
import { useChannelVideos } from 'hooks';
import { getDateBefore } from 'helpers/utils';

interface ChannelGridProps {
  channel: Channel;
  onError?: (error: any) => void;
}

const publishedAfter = getDateBefore(10).toISOString();

function ChannelGrid(props: ChannelGridProps) {
  const { channel, onError } = props;
  const maxResults = 6;
  const {
    data: videos,
    error,
    isLoading,
  } = useChannelVideos({ channel, publishedAfter, maxResults });

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
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
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={index}>
                  <VideoSkeleton />
                </Grid>
              ))
            : videos.map((video: Video, index: number) => (
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={index}>
                  <VideoCard video={video} />
                </Grid>
              ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default React.memo(ChannelGrid);
