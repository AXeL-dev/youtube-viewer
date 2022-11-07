/* eslint-disable react-hooks/exhaustive-deps */
import { debounce } from 'helpers/utils';
import { useDidMountEffect } from 'hooks';
import {
  createContext,
  FC,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAppSelector } from 'store';
import { views } from 'store/reducers/settings';
import { selectHiddenChannels } from 'store/selectors/channels';
import { GetChannelVideosResponse } from 'store/services/youtube';
import { Channel, Video, HomeView } from 'types';

export interface ChannelData extends Omit<GetChannelVideosResponse, 'count'> {
  channel: Channel;
}

export interface ChannelVideosCount {
  current: number;
  total: number;
}

type ChannelVideosContextType = {
  getAllVideosCount: (view: HomeView) => number;
  getChannelData: (view: HomeView, channel: Channel) => ChannelData | undefined;
  setChannelData: (view: HomeView, data: ChannelData) => void;
  clearChannelsData: (view: HomeView) => void;
  getLatestChannelVideo: (
    view: HomeView,
    channel: Channel,
  ) => Video | undefined;
  getChannelVideosCount: (view: HomeView, channel: Channel) => number;
};

const initialVideosCount = views.reduce(
  (acc, view) => ({
    ...acc,
    [view]: {
      current: 0,
      total: 0,
    },
  }),
  {},
);

const initialChannelsMap = views.reduce(
  (acc, view) => ({ ...acc, [view]: new Map() }),
  {},
);

const ChannelVideosContext = createContext<
  ChannelVideosContextType | undefined
>(undefined);

export const ChannelVideosProvider: FC = memo(({ children }) => {
  const [videosCount, setVideosCount] = useState<{
    [key: string]: ChannelVideosCount;
  }>(initialVideosCount);
  const channelsMap = useRef<{ [key: string]: Map<string, ChannelData> }>(
    initialChannelsMap,
  );
  const hiddenChannels = useAppSelector(selectHiddenChannels);

  const updateCount = useCallback(
    debounce((view: HomeView, count: ChannelVideosCount) => {
      setVideosCount((state) => ({
        ...state,
        [view]: count,
      }));
    }, 200),
    [],
  );

  const getCount = (
    view: HomeView,
    filterCallback: (data: ChannelData) => boolean = () => true,
  ) => {
    const channelsData = Array.from(channelsMap.current[view].values());
    const count = channelsData.filter(filterCallback).reduce(
      (acc, data) => ({
        current: acc.current + (data.items?.length || 0),
        total: acc.total + (data.total || 0),
      }),
      { current: 0, total: 0 },
    );
    return count;
  };

  useDidMountEffect(() => {
    // update videos count for the all view (since it is the only view where we hide channels)
    const hiddenChannelsIds = hiddenChannels.map(({ id }) => id);
    const count = getCount(
      HomeView.All,
      ({ channel }) => !hiddenChannelsIds.includes(channel.id),
    );
    updateCount(HomeView.All, count);
  }, [hiddenChannels]);

  const setChannelData = (view: HomeView, data: ChannelData) => {
    // save channel data per view
    channelsMap.current[view].set(data.channel.id, data);
    // update videos count per view
    const count = getCount(view);
    updateCount(view, count);
  };

  const clearChannelsData = (view: HomeView) => {
    channelsMap.current[view].clear();
    setVideosCount((state) => ({
      ...state,
      [view]: {
        current: 0,
        total: 0,
      },
    }));
  };

  const getChannelData = (view: HomeView, channel: Channel) => {
    return channelsMap.current[view].get(channel.id);
  };

  const getLatestChannelVideo = (view: HomeView, channel: Channel) => {
    const channelData = getChannelData(view, channel);
    return channelData?.items[0];
  };

  const getChannelVideosCount = (view: HomeView, channel: Channel) => {
    const channelData = getChannelData(view, channel);
    switch (view) {
      case HomeView.All:
        return channelData?.items.length || 0;
      default:
        return channelData?.total || 0;
    }
  };

  const getAllVideosCount = (view: HomeView) => {
    const count = videosCount[view];
    switch (view) {
      case HomeView.All:
        return count.current;
      default:
        return count.total;
    }
  };

  const value = useMemo(
    () => ({
      getAllVideosCount,
      getChannelData,
      setChannelData,
      clearChannelsData,
      getLatestChannelVideo,
      getChannelVideosCount,
    }),
    [videosCount],
  );

  return (
    <ChannelVideosContext.Provider value={value}>
      {children}
    </ChannelVideosContext.Provider>
  );
});

type ChannelVideosHookType = {
  getAllVideosCount: () => number;
  getChannelData: (channel: Channel) => ChannelData | undefined;
  setChannelData: (data: ChannelData) => void;
  clearChannelsData: () => void;
  getLatestChannelVideo: (channel: Channel) => Video | undefined;
  getChannelVideosCount: (channel: Channel) => number;
};

export function useChannelVideos(view: HomeView): ChannelVideosHookType {
  const context = useContext(ChannelVideosContext);

  if (context === undefined) {
    throw new Error(
      'useChannelVideos must be used within a ChannelVideosContext',
    );
  }

  const {
    getAllVideosCount,
    getChannelData,
    setChannelData,
    clearChannelsData,
    getLatestChannelVideo,
    getChannelVideosCount,
  } = context;

  return {
    getAllVideosCount: () => getAllVideosCount(view),
    getChannelData: (channel) => getChannelData(view, channel),
    setChannelData: (data) => setChannelData(view, data),
    clearChannelsData: () => clearChannelsData(view),
    getLatestChannelVideo: (channel) => getLatestChannelVideo(view, channel),
    getChannelVideosCount: (channel) => getChannelVideosCount(view, channel),
  };
}
