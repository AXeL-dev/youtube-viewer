import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import {
  Channel,
  HomeView,
  Video,
  VideoCache,
  VideoFlag,
  ViewFilter,
  ViewFilters,
} from 'types';
import { selectActiveChannels } from './channels';
import { selectViewFilters } from './settings';

export const selectVideos = (state: RootState) => state.videos.list;

export const selectChannelVideos = (channel: Channel, filters?: ViewFilters) =>
  createSelector(selectVideos, (videos) =>
    videos.filter(
      (video) =>
        channel.id === video.channelId &&
        (!filters || filterVideoByFlags(video, filters)),
    ),
  );

export const selectViewedVideos = (channel?: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos.filter(
      ({ flags, channelId }) =>
        flags.viewed && (!channel || channel.id === channelId),
    ),
  );

export const selectNotifiedVideos = (channel?: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos.filter(
      ({ flags, channelId }) =>
        flags.notified && (!channel || channel.id === channelId),
    ),
  );

const filter2Flag = (key: ViewFilter): VideoFlag => {
  switch (key) {
    case 'watchLater':
      return 'toWatchLater';
    default:
      return key as VideoFlag;
  }
};

export const filterVideoByFlags = (video: VideoCache, filters: ViewFilters) => {
  const filterKeys = Object.keys(filters) as ViewFilter[];
  const hasFlag = (key: ViewFilter) => {
    const flag = filter2Flag(key);
    return video.flags[flag];
  };
  return filterKeys.some((key) => {
    switch (key) {
      case 'uncategorised':
        return (
          filters.uncategorised &&
          filterKeys
            .filter((key) => !['uncategorised'].includes(key))
            .every((key) => !hasFlag(key))
        );
      default:
        return filters[key] && hasFlag(key);
    }
  });
};

export const selectWatchLaterVideos = (channel?: Channel) =>
  createSelector(
    selectVideos,
    selectViewFilters(HomeView.WatchLater),
    (videos, filters) =>
      videos
        .filter(
          (video) =>
            video.flags.toWatchLater &&
            (!channel || channel.id === video.channelId) &&
            filterVideoByFlags(video, filters),
        )
        .sort((a, b) => b.publishedAt - a.publishedAt),
  );

export const selectWatchLaterVideosCount = createSelector(
  selectVideos,
  selectViewFilters(HomeView.WatchLater),
  selectActiveChannels,
  (videos, filters, activeChannels) => {
    const activeChannelsIds = activeChannels.map(({ id }) => id);
    return videos.filter(
      (video) =>
        video.flags.toWatchLater &&
        activeChannelsIds.includes(video.channelId) &&
        filterVideoByFlags(video, filters),
    ).length;
  },
);

export const selectViewedWatchLaterVideosCount = createSelector(
  selectVideos,
  selectActiveChannels,
  (videos, activeChannels) => {
    const activeChannelsIds = activeChannels.map(({ id }) => id);
    return videos.filter(
      ({ flags, channelId }) =>
        flags.toWatchLater &&
        flags.viewed &&
        activeChannelsIds.includes(channelId),
    ).length;
  },
);

export const selectVideoMeta = (video: Video) =>
  createSelector(selectVideos, (videos) => {
    const { flags } = videos.find(({ id }) => id === video.id) || {};
    return {
      isViewed: flags?.viewed || false,
      isToWatchLater: flags?.toWatchLater || false,
      isArchived: flags?.archived || false,
    };
  });
