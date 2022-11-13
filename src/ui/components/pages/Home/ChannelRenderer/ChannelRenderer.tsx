import React from 'react';
import { Box } from '@mui/material';
import { Channel, HomeView, Video } from 'types';
import ChannelTitle from './ChannelTitle';
import ChannelVideos from './ChannelVideos';
import { ChannelOptionsProvider, useChannelOptions } from 'providers';

export interface ChannelRendererProps {
  view: HomeView;
  channel: Channel;
  videos: Video[];
  count?: number;
  total: number;
  isLoading: boolean;
  itemsPerRow: number;
  maxResults: number;
  onLoadMore: () => void;
  onVideoPlay: (video: Video) => void;
}

// Note: max 50 videos per channel, check the useGetChannelVideos hook for more details
export const limit = 50;

function ChannelRenderer(props: ChannelRendererProps) {
  const {
    view,
    channel,
    videos,
    count,
    total,
    isLoading,
    maxResults,
    ...rest
  } = props;
  const videosCount = count || videos.length;
  const hasVideos = isLoading || videos.length > 0;
  const hasMore = videosCount > 0 && videosCount < limit && total > maxResults;
  const { collapsed } = useChannelOptions();

  return hasVideos ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        pb: 3,
      }}
    >
      <ChannelTitle view={view} channel={channel} />
      {!collapsed ? (
        <ChannelVideos
          view={view}
          videos={videos}
          isLoading={isLoading}
          maxResults={maxResults}
          hasMore={hasMore}
          {...rest}
        />
      ) : null}
    </Box>
  ) : null;
}

function ChannelRendererWrapper(props: ChannelRendererProps) {
  const { view } = props;

  return (
    <ChannelOptionsProvider view={view}>
      <ChannelRenderer {...props} />
    </ChannelOptionsProvider>
  );
}

function propsAreEqual(
  prevProps: ChannelRendererProps,
  nextProps: ChannelRendererProps,
) {
  return (
    prevProps.view === nextProps.view &&
    prevProps.channel.id === nextProps.channel.id &&
    prevProps.count === nextProps.count &&
    prevProps.total === nextProps.total &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.itemsPerRow === nextProps.itemsPerRow &&
    prevProps.maxResults === nextProps.maxResults &&
    JSON.stringify(prevProps.videos.map(({ id }) => id)) ===
      JSON.stringify(nextProps.videos.map(({ id }) => id))
  );
}

export default React.memo(ChannelRendererWrapper, propsAreEqual);
