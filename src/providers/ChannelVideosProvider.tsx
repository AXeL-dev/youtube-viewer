/* eslint-disable react-hooks/exhaustive-deps */
import { debounce } from 'helpers/utils';
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
import { views } from 'store/reducers/settings';
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
  videosCount: { [key: string]: ChannelVideosCount };
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
  const [videosCount, setVideosCount] =
    useState<ChannelVideosContextType['videosCount']>(initialVideosCount);
  const channelsMap = useRef<{ [key: string]: Map<string, ChannelData> }>(
    initialChannelsMap,
  );

  const updateCount = useCallback(
    debounce((view: HomeView, count: ChannelVideosCount) => {
      setVideosCount((state) => ({
        ...state,
        [view]: count,
      }));
    }, 200),
    [],
  );

  const setChannelData = (view: HomeView, data: ChannelData) => {
    // save channel data per view
    channelsMap.current[view].set(data.channel.id, data);
    // update videos count per view
    const channelsData = Array.from(channelsMap.current[view].values());
    const count = channelsData.reduce(
      (acc, data) => ({
        current: acc.current + (data.items?.length || 0),
        total: acc.total + (data.total || 0),
      }),
      { current: 0, total: 0 },
    );
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

  const value = useMemo(
    () => ({
      videosCount,
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
  videosCount: ChannelVideosCount;
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
    videosCount,
    getChannelData,
    setChannelData,
    clearChannelsData,
    getLatestChannelVideo,
    getChannelVideosCount,
  } = context;

  return {
    videosCount: videosCount[view],
    getChannelData: (channel) => getChannelData(view, channel),
    setChannelData: (data) => setChannelData(view, data),
    clearChannelsData: () => clearChannelsData(view),
    getLatestChannelVideo: (channel) => getLatestChannelVideo(view, channel),
    getChannelVideosCount: (channel) => getChannelVideosCount(view, channel),
  };
}
