import { DependencyList, useEffect } from 'react';
import { Channel, HomeView, Video } from 'types';
import { useChannelVideos } from 'providers';

export interface ChannelDataHandlerProps {
  view: HomeView;
  channel: Channel;
  videos: Video[];
  total: number;
  isFetching: boolean;
  hasData: boolean;
  deps: DependencyList;
}

function ChannelDataHandler(props: ChannelDataHandlerProps) {
  const { view, channel, videos, total, isFetching, hasData, deps } = props;
  const { setChannelData } = useChannelVideos(view);

  useEffect(() => {
    if (!isFetching && hasData) {
      setChannelData({ channel, items: videos, total });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return null;
}

export default ChannelDataHandler;
