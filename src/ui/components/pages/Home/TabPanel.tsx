import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { Alert } from 'ui/components/shared';
import { Channel, HomeView, Video } from 'types';
import { useAppSelector } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import PlayVideoDialog from './PlayVideoDialog';
import { DefaultRenderer, WatchLaterRenderer } from './ChannelRenderer';
import { getDateBefore } from 'helpers/utils';

interface TabPanelProps {
  tab: HomeView;
}

export default function TabPanel(props: TabPanelProps) {
  const { tab } = props;
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const channels = useAppSelector(selectActiveChannels);
  const [ChannelRenderer, rendererProps] = useMemo(() => {
    switch (tab) {
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
  }, [tab]);

  const handleVideoPlay = (video: Video) => {
    setActiveVideo(video);
  };

  const handleVideoDialogClose = () => {
    setActiveVideo(null);
  };

  const handleError = (err: any) => {
    setError(err);
  };

  return error ? (
    <Alert error={error} closable />
  ) : (
    <>
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
            view={tab}
            channel={channel}
            onError={handleError}
            onVideoPlay={handleVideoPlay}
            {...rendererProps}
          />
        ))}
      </Box>
      <PlayVideoDialog
        open={!!activeVideo}
        video={activeVideo}
        onClose={handleVideoDialogClose}
      />
    </>
  );
}
