import React, { useState, useRef } from 'react';
import { Alert } from 'ui/components/shared';
import { Channel, HomeView, Video, Nullable } from 'types';
import { useAppSelector } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import { GetChannelVideosResponse } from 'store/services/youtube';
import VideoPlayerDialog from './VideoPlayerDialog';
import ChannelsWrapper from './ChannelsWrapper';
import NoChannels from './NoChannels';
import { selectViewSorting } from 'store/selectors/settings';

interface ChannelData extends GetChannelVideosResponse {
  channel: Channel;
}

interface ChannelMetaData {
  latestVideo: Video;
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
  const channelsMetaData = useRef<Map<string, ChannelMetaData>>(new Map());
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

  const handleChange = (data: ChannelData) => {
    channelsMetaData.current.set(data.channel.id, {
      latestVideo: data.items[0],
    });
    if (onCountChange) {
      channelsMap.current.set(data.channel.id, data);
      if (channelsMap.current.size === channels.length) {
        const channelsData = Array.from(channelsMap.current.values());
        const count = channelsData.reduce(
          (acc, cur) => ({
            displayed: acc.displayed + (cur.items?.length || 0),
            total: acc.total + (cur.total || 0),
          }),
          { displayed: 0, total: 0 },
        );
        onCountChange(tab, count);
        channelsMap.current.clear();
      }
    }
  };

  const getChannelTimestamp = (channel: Channel) => {
    return (
      channelsMetaData.current.get(channel.id)?.latestVideo?.publishedAt || 0
    );
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
