import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Channel, HomeView, Video } from 'types';
import ChannelTitle from './ChannelTitle';
import { getDateBefore } from 'helpers/utils';
import { useGetChannelVideosQuery } from 'store/services/youtube';
import ChannelVideos from './ChannelVideos';

export interface RecentViewProps {
  channel: Channel;
  publishedAfter?: string;
  maxResults?: number;
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function RecentView(props: RecentViewProps) {
  const {
    channel,
    publishedAfter = getDateBefore(1).toISOString(),
    maxResults: maxResultsProp = 6,
    onError,
    onVideoPlay,
  } = props;
  const [maxResults, setMaxResults] = useState(maxResultsProp);
  const {
    data: videos = [],
    error,
    isLoading,
    isFetching,
  } = useGetChannelVideosQuery({
    channel,
    publishedAfter,
    maxResults,
  });
  const hasVideos = isLoading || videos.length > 0;

  const handleLoadMore = () => {
    setMaxResults(maxResults + maxResultsProp);
  };

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
      <ChannelVideos
        videos={videos}
        isLoading={isLoading || isFetching}
        maxResults={maxResults}
        view={HomeView.All}
        onVideoPlay={onVideoPlay}
        onLoadMore={handleLoadMore}
      />
    </Box>
  ) : null;
}

export default React.memo(RecentView);
