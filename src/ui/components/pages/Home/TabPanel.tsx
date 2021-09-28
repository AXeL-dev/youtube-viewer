import React, { useState } from 'react';
import { Alert } from 'ui/components/shared';
import { HomeView, Video } from 'types';
import { useAppSelector } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import VideoPlayerDialog from './VideoPlayerDialog';
import ChannelsWrapper from './ChannelsWrapper';
import NoChannels from './NoChannels';

interface TabPanelProps {
  tab: HomeView;
  onSuccess?: (tab: HomeView, data: any) => void;
}

function TabPanel(props: TabPanelProps) {
  const { tab, onSuccess } = props;
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const channels = useAppSelector(selectActiveChannels);

  const handleVideoPlay = (video: Video) => {
    setActiveVideo(video);
  };

  const handleVideoDialogClose = () => {
    setActiveVideo(null);
  };

  const handleError = (err: any) => {
    setError(err);
  };

  const handleSuccess = (data: any) => {
    if (onSuccess) {
      onSuccess(tab, data);
    }
  };

  return error ? (
    <Alert error={error} closable />
  ) : (
    <>
      {channels.length > 0 ? (
        <ChannelsWrapper
          view={tab}
          channels={channels}
          onError={handleError}
          onSuccess={handleSuccess}
          onVideoPlay={handleVideoPlay}
        />
      ) : (
        <NoChannels />
      )}
      <VideoPlayerDialog
        open={!!activeVideo}
        video={activeVideo}
        onClose={handleVideoDialogClose}
      />
    </>
  );
}

export default React.memo(TabPanel);
