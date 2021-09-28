import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { Channel, HomeView, Video } from 'types';
import {
  DefaultRenderer,
  RecentViewRenderer,
  WatchLaterViewRenderer,
} from './ChannelRenderer';

interface ChannelsWrapperProps {
  view: HomeView;
  channels: Channel[];
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  onVideoPlay: (video: Video) => void;
}

function ChannelsWrapper(props: ChannelsWrapperProps) {
  const { view, channels, onError, onSuccess, onVideoPlay } = props;
  const ChannelRenderer = useMemo(() => {
    switch (view) {
      case HomeView.WatchLater:
        return WatchLaterViewRenderer;
      case HomeView.Recent:
        return RecentViewRenderer;
      default:
        return DefaultRenderer;
    }
  }, [view]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        px: 3,
        pt: 3,
      }}
    >
      {channels.map((channel: Channel, index: number) => (
        <ChannelRenderer
          key={index}
          view={view}
          channel={channel}
          onError={onError}
          onSuccess={onSuccess}
          onVideoPlay={onVideoPlay}
        />
      ))}
    </Box>
  );
}

function propsAreEqual(
  prevProps: ChannelsWrapperProps,
  nextProps: ChannelsWrapperProps
) {
  return (
    prevProps.view === nextProps.view &&
    JSON.stringify(prevProps.channels.map(({ id }) => id)) ===
      JSON.stringify(nextProps.channels.map(({ id }) => id))
  );
}

export default React.memo(ChannelsWrapper, propsAreEqual);
