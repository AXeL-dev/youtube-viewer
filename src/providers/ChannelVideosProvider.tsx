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
import { GetChannelVideosResponse } from 'store/services/youtube';
import { Channel, Video, HomeView } from 'types';

export interface ChannelData extends GetChannelVideosResponse {
  channel: Channel;
}

export interface ChannelVideosCount {
  displayed: number;
  total: number;
}

type ChannelVideosContextType = {
  videosCount: { [key: string]: ChannelVideosCount };
  setChannelData: (view: HomeView, data: ChannelData) => void;
  clearChannelsData: (view: HomeView) => void;
  getLatestChannelVideo: (
    view: HomeView,
    channelId: string,
  ) => Video | undefined;
};

const ALL_VIEWS = [HomeView.All, HomeView.Recent, HomeView.WatchLater];

const INITIAL_COUNT = ALL_VIEWS.reduce(
  (acc, view) => ({
    ...acc,
    [view]: {
      displayed: 0,
      total: 0,
    },
  }),
  {},
);

const ChannelVideosContext = createContext<
  ChannelVideosContextType | undefined
>(undefined);

export const ChannelVideosProvider: FC = memo(({ children }) => {
  const [videosCount, setVideosCount] =
    useState<ChannelVideosContextType['videosCount']>(INITIAL_COUNT);
  const channelsMap = useRef<{ [key: string]: Map<string, ChannelData> }>(
    ALL_VIEWS.reduce((acc, view) => ({ ...acc, [view]: new Map() }), {}),
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
      (acc, cur) => ({
        displayed: acc.displayed + (cur.items?.length || 0),
        total: acc.total + (cur.total || 0),
      }),
      { displayed: 0, total: 0 },
    );
    updateCount(view, count);
  };

  const clearChannelsData = (view: HomeView) => {
    channelsMap.current[view].clear();
    setVideosCount((state) => ({
      ...state,
      [view]: {
        displayed: 0,
        total: 0,
      },
    }));
  };

  const getLatestChannelVideo = (view: HomeView, channelId: string) => {
    return channelsMap.current[view].get(channelId)?.items[0];
  };

  const value = useMemo(
    () => ({
      videosCount,
      setChannelData,
      clearChannelsData,
      getLatestChannelVideo,
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
  setChannelData: (data: ChannelData) => void;
  clearChannelsData: () => void;
  getLatestChannelVideo: (channelId: string) => Video | undefined;
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
    setChannelData,
    clearChannelsData,
    getLatestChannelVideo,
  } = context;

  return {
    videosCount: videosCount[view],
    setChannelData: (data) => setChannelData(view, data),
    clearChannelsData: () => clearChannelsData(view),
    getLatestChannelVideo: (channelId) =>
      getLatestChannelVideo(view, channelId),
  };
}
