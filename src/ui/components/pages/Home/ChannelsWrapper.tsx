import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { Channel, HomeView, Video } from 'types';
import { DefaultRenderer, WatchLaterRenderer } from './ChannelRenderer';
import { getDateBefore } from 'helpers/utils';

interface ChannelsWrapperProps {
  view: HomeView;
  channels: Channel[];
  onError?: (error: any) => void;
  onVideoPlay: (video: Video) => void;
}

function ChannelsWrapper(props: ChannelsWrapperProps) {
  const { view, channels, onError, onVideoPlay } = props;
  const [ChannelRenderer, rendererProps] = useMemo(() => {
    switch (view) {
      case HomeView.WatchLater:
        return [WatchLaterRenderer];
      case HomeView.Recent:
        return [
          DefaultRenderer,
          { publishedAfter: getDateBefore(1).toISOString() },
        ];
      default:
        return [DefaultRenderer];
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
          onVideoPlay={onVideoPlay}
          {...rendererProps}
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
    JSON.stringify(prevProps.channels) === JSON.stringify(nextProps.channels)
  );
}

export default React.memo(ChannelsWrapper, propsAreEqual);
