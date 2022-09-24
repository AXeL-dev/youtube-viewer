import React, { useState } from 'react';
import { Alert } from 'ui/components/shared';
import { Channel, HomeView, Video, Nullable } from 'types';
import { useAppSelector } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import VideoPlayerDialog from './VideoPlayerDialog';
import ChannelsWrapper from './ChannelsWrapper';
import NoChannels from './NoChannels';
import { selectViewSorting } from 'store/selectors/settings';
import { useChannelVideos } from 'providers';

interface TabPanelProps {
  tab: HomeView;
}

function TabPanel(props: TabPanelProps) {
  const { tab } = props;
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState<Nullable<Video>>(null);
  const { getLatestChannelVideo } = useChannelVideos(tab);
  const channels = useAppSelector(selectActiveChannels);
  const sorting = useAppSelector(selectViewSorting(tab));

  const handleVideoPlay = (video: Video) => {
    setActiveVideo(video);
  };

  const handleVideoDialogClose = () => {
    setActiveVideo(null);
  };

  const handleError = (err: any) => {
    setError(err);
  };

  const getChannelTimestamp = (channel: Channel) => {
    return getLatestChannelVideo(channel.id)?.publishedAt || 0;
  };

  // NOTE: cloning the channels array is required to trigger a re-render
  const sortedChannels = sorting.publishDate
    ? [...channels].sort(
        (a, b) => getChannelTimestamp(b) - getChannelTimestamp(a),
      )
    : channels;

  return error ? (
    <Alert error={error} closable />
  ) : (
    <>
      {channels.length > 0 ? (
        <ChannelsWrapper
          view={tab}
          channels={sortedChannels}
          onError={handleError}
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
