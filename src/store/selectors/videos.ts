import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import {
  Channel,
  HomeView,
  Video,
  VideoFlag,
  VideoFlags,
  ViewFilter,
  ViewFilters,
} from 'types';
import { selectChannels, selectHiddenChannels } from './channels';
import { selectViewFilters } from './settings';

export const selectVideos = (state: RootState) => state.videos.list;

export const selectChannelVideos = (channel: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos.filter(({ channelId }) => channel.id === channelId)
  );

export const selectViewedVideos = (channel?: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos.filter(
      ({ flags, channelId }) =>
        flags.viewed && (!channel || channel.id === channelId)
    )
  );

export const selectNotifiedVideos = (channel?: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos.filter(
      ({ flags, channelId }) =>
        flags.notified && (!channel || channel.id === channelId)
    )
  );

const filter2Flag = (key: ViewFilter): VideoFlag => {
  switch (key) {
    case 'watchLater':
      return 'toWatchLater';
    default:
      return key as VideoFlag;
  }
};

export const filterVideoByFlags = (flags: VideoFlags, filters: ViewFilters) => {
  const filterKeys = Object.keys(filters) as ViewFilter[];
  return filterKeys.some((key) => {
    switch (key) {
      case 'uncategorised':
        return (
          filters.uncategorised &&
          filterKeys
            .filter((key) => key !== 'uncategorised')
            .every((key) => {
              const flag = filter2Flag(key);
              return !flags[flag];
            })
        );
      default: {
        const flag = filter2Flag(key);
        return filters[key] && flags[flag];
      }
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
          ({ flags, channelId }) =>
            flags.toWatchLater &&
            (!channel || channel.id === channelId) &&
            filterVideoByFlags(flags, filters)
        )
        .sort((a, b) => b.publishedAt - a.publishedAt)
  );

export const selectWatchLaterVideosCount = createSelector(
  selectVideos,
  selectViewFilters(HomeView.WatchLater),
  selectChannels,
  (videos, filters, channels) => {
    const channelsIds = channels.map(({ id }) => id);
    const hiddenChannelsIds = channels
      .filter(({ isHidden }) => isHidden)
      .map(({ id }) => id);
    return videos.filter(
      ({ flags, channelId }) =>
        flags.toWatchLater &&
        channelsIds.includes(channelId) &&
        !hiddenChannelsIds.includes(channelId) &&
        filterVideoByFlags(flags, filters)
    ).length;
  }
);

export const selectViewedWatchLaterVideosCount = createSelector(
  selectVideos,
  selectHiddenChannels,
  (videos, hiddenChannels) => {
    const hiddenChannelsIds = hiddenChannels.map(({ id }) => id);
    return videos.filter(
      ({ flags, channelId }) =>
        flags.toWatchLater &&
        flags.viewed &&
        !hiddenChannelsIds.includes(channelId)
    ).length;
  }
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
