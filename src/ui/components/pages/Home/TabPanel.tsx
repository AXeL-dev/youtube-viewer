import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { Alert } from 'ui/components/shared';
import { Channel, HomeView, Video } from 'types';
import { useAppSelector } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import PlayVideoDialog from './dialogs/PlayVideoDialog';
import { AllView, RecentView, WatchLaterView } from './views';

interface TabPanelProps {
  tab: HomeView;
}

export default function TabPanel(props: TabPanelProps) {
  const { tab } = props;
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const channels = useAppSelector(selectActiveChannels);
  const ViewComponent = useMemo(() => {
    switch (tab) {
      case HomeView.WatchLater:
        return WatchLaterView;
      case HomeView.Recent:
        return RecentView;
      default:
        return AllView;
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
          <ViewComponent
            key={index}
            channel={channel}
            onError={handleError}
            onVideoPlay={handleVideoPlay}
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
