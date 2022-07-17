import React from 'react';
import { Box } from '@mui/material';
import { Channel, HomeView, Video } from 'types';
import ChannelTitle from './ChannelTitle';
import ChannelVideos from './ChannelVideos';

export interface ChannelRendererProps {
  view: HomeView;
  channel: Channel;
  videos: Video[];
  total: number;
  isLoading: boolean;
  itemsPerRow: number;
  maxResults: number;
  onLoadMore: () => void;
  onVideoPlay: (video: Video) => void;
}

function ChannelRenderer(props: ChannelRendererProps) {
  const { channel, videos, total, isLoading, maxResults, ...rest } = props;
  const hasVideos = isLoading || videos.length > 0;
  const hasMore =
    videos.length > 0 && videos.length >= maxResults && total > maxResults;

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
        isLoading={isLoading}
        maxResults={maxResults}
        hasMore={hasMore}
        {...rest}
      />
    </Box>
  ) : null;
}

function propsAreEqual(
  prevProps: ChannelRendererProps,
  nextProps: ChannelRendererProps
) {
  return (
    prevProps.view === nextProps.view &&
    prevProps.channel.id === nextProps.channel.id &&
    prevProps.total === nextProps.total &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.itemsPerRow === nextProps.itemsPerRow &&
    prevProps.maxResults === nextProps.maxResults &&
    JSON.stringify(prevProps.videos.map(({ id }) => id)) ===
      JSON.stringify(nextProps.videos.map(({ id }) => id))
  );
}

export default React.memo(ChannelRenderer, propsAreEqual);
