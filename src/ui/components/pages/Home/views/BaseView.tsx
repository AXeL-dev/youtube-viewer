import React from 'react';
import { Box } from '@mui/material';
import { Channel, HomeView, Video } from 'types';
import ChannelTitle from './ChannelTitle';
import ChannelVideos from './ChannelVideos';

export interface BaseViewProps {
  view: HomeView;
  channel: Channel;
  videos: Video[];
  total: number;
  isLoading: boolean;
  maxResults: number;
  onLoadMore: () => void;
  onVideoPlay: (video: Video) => void;
}

function BaseView(props: BaseViewProps) {
  const { channel, videos, total, isLoading, maxResults, ...rest } = props;
  const hasVideos = isLoading || videos.length > 0;
  const canLoadMore = total > maxResults;
  const hasMore = total > 0 && ((isLoading && canLoadMore) || canLoadMore);

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

export default React.memo(BaseView);
