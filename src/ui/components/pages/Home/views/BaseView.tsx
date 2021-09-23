import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Channel, HomeView, Video } from 'types';
import ChannelTitle from './ChannelTitle';
import ChannelVideos from './ChannelVideos';

export interface BaseViewProps {
  view: HomeView;
  channel: Channel;
  videos: Video[];
  error: any;
  isLoading: boolean;
  maxResults: number;
  hasMore: boolean;
  onError?: (error: any) => void;
  onLoadMore: () => void;
  onVideoPlay: (video: Video) => void;
}

function BaseView(props: BaseViewProps) {
  const { channel, videos, error, isLoading, onError, ...rest } = props;
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
      <ChannelVideos videos={videos} isLoading={isLoading} {...rest} />
    </Box>
  ) : null;
}

export default React.memo(BaseView);
