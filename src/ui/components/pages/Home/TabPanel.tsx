import React, { useState, useRef } from 'react';
import { Alert } from 'ui/components/shared';
import { Channel, HomeView, Video, Nullable } from 'types';
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
  const [activeVideo, setActiveVideo] = useState<Nullable<Video>>(null);
  const channels = useAppSelector(selectActiveChannels);
  const channelsMap = useRef<Map<string, ChannelData>>(new Map());

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
      channelsMap.current.set(data.channel.id, data);
      if (channelsMap.current.size === channels.length) {
        const channelsData = Array.from(channelsMap.current.values());
        const count = channelsData.reduce(
          (acc, cur) => ({
            displayed: acc.displayed + (cur.items?.length || 0),
            total: acc.total + (cur.total || 0),
          }),
          { displayed: 0, total: 0 }
        );
        onCountChange(tab, count);
        channelsMap.current.clear();
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
