import React, { useState, useRef } from 'react';
import { Alert } from 'ui/components/shared';
import { Channel, HomeView, Video } from 'types';
import { useAppSelector } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import { GetChannelVideosResponse } from 'store/services/youtube';
import VideoPlayerDialog from './VideoPlayerDialog';
import ChannelsWrapper from './ChannelsWrapper';
import NoChannels from './NoChannels';

interface ChannelData extends GetChannelVideosResponse {
  channel: Channel;
}

export interface RecentVideosCount {
  displayed: number;
  total: number;
}

interface TabPanelProps {
  tab: HomeView;
  onCountChange?: (tab: HomeView, count: RecentVideosCount) => void;
}

function TabPanel(props: TabPanelProps) {
  const { tab, onCountChange } = props;
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const channels = useAppSelector(selectActiveChannels);
  const channelsData = useRef<ChannelData[]>([]);

  const handleVideoPlay = (video: Video) => {
    setActiveVideo(video);
  };

  const handleVideoDialogClose = () => {
    setActiveVideo(null);
  };

  const handleError = (err: any) => {
    setError(err);
  };

  const handleChange = (data: ChannelData) => {
    if (onCountChange) {
      channelsData.current.push(data);
      if (channelsData.current.length === channels.length) {
        const count = channelsData.current.reduce(
          (acc, cur) => ({
            displayed: acc.displayed + (cur.items?.length || 0),
            total: acc.total + (cur.total || 0),
          }),
          { displayed: 0, total: 0 }
        );
        onCountChange(tab, count);
        channelsData.current = [];
      }
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
          onChange={handleChange}
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
