import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import {
  Channel,
  HomeView,
  Video,
  VideoCache,
  VideoFlag,
  VideosSeniority,
  ViewFilter,
  ViewFilters,
} from 'types';
import { selectChannelsByView } from './channels';
import {
  selectSettings,
  selectVideosSeniority,
  selectViewFilters,
} from './settings';
import { elapsedDays } from 'helpers/utils';

export const selectVideos = (state: RootState) => state.videos.list;

export const selectChannelVideos = (channel: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos.filter(({ channelId }) => channel.id === channelId),
  );

export const selectClassifiedChannelVideos = (
  channel: Channel,
  view: HomeView,
) =>
  createSelector(
    selectChannelVideos(channel),
    selectViewFilters(view),
    (videos, filters) =>
      videos.reduce(
        (acc, video) => {
          const key = filterVideoByFlags(video, filters)
            ? 'included'
            : 'excluded';
          return {
            ...acc,
            [key]: [...acc[key], video.id],
          };
        },
        { excluded: [] as string[], included: [] as string[] },
      ),
  );

export const selectUnflaggedVideos = (channel?: Channel) =>
  createSelector(selectVideos, selectSettings, (videos, settings) =>
    videos.filter(
      ({ flags = {}, channelId, publishedAt }) =>
        Object.keys(flags).every(
          (key) =>
            ['recent', 'notified'].includes(key) || !flags[key as VideoFlag],
        ) &&
        (!channel || channel.id === channelId) &&
        elapsedDays(publishedAt) <=
          settings.viewOptions[HomeView.All].videosSeniority,
    ),
  );

export const selectSeenVideos = (channel?: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos.filter(
      ({ flags, channelId }) =>
        flags.seen && (!channel || channel.id === channelId),
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

const filterVideoByFlags = (video: VideoCache, filters: ViewFilters) => {
  const filterKeys = Object.keys(filters) as ViewFilter[];
  const hasFlag = (key: ViewFilter) => {
    const flag = filter2Flag(key);
    return video.flags[flag];
  };
  return filterKeys.some((key) => {
    switch (key) {
      case 'others':
        return (
          filters.others &&
          filterKeys
            .filter((key) => !['others'].includes(key))
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
    selectVideosSeniority(HomeView.WatchLater),
    (videos, filters, videosSeniority) =>
      videos
        .filter(
          (video) =>
            video.flags.toWatchLater &&
            (!channel || channel.id === video.channelId) &&
            filterVideoByFlags(video, filters) &&
            (videosSeniority === VideosSeniority.Any ||
              elapsedDays(video.publishedAt) <= videosSeniority),
        )
        .sort((a, b) => b.publishedAt - a.publishedAt),
  );

export const selectBookmarkedVideos = (channel?: Channel) =>
  createSelector(
    selectVideos,
    selectViewFilters(HomeView.Bookmarks),
    selectVideosSeniority(HomeView.Bookmarks),
    (videos, filters, videosSeniority) =>
      videos
        .filter(
          (video) =>
            video.flags.bookmarked &&
            (!channel || channel.id === video.channelId) &&
            filterVideoByFlags(video, filters) &&
            (videosSeniority === VideosSeniority.Any ||
              elapsedDays(video.publishedAt) <= videosSeniority),
        )
        .sort((a, b) => b.publishedAt - a.publishedAt),
  );

export const selectBookmarkedVideosCount = createSelector(
  selectVideos,
  selectViewFilters(HomeView.Bookmarks),
  selectVideosSeniority(HomeView.Bookmarks),
  selectChannelsByView(HomeView.Bookmarks),
  (videos, filters, videosSeniority, channels) => {
    const channelsIds = channels.map(({ id }) => id);
    return videos.filter(
      (video) =>
        video.flags.bookmarked &&
        channelsIds.includes(video.channelId) &&
        filterVideoByFlags(video, filters) &&
        (videosSeniority === VideosSeniority.Any ||
          elapsedDays(video.publishedAt) <= videosSeniority),
    ).length;
  },
);

export const selectWatchLaterVideosCount = createSelector(
  selectVideos,
  selectViewFilters(HomeView.WatchLater),
  selectVideosSeniority(HomeView.WatchLater),
  selectChannelsByView(HomeView.WatchLater),
  (videos, filters, videosSeniority, channels) => {
    const channelsIds = channels.map(({ id }) => id);
    return videos.filter(
      (video) =>
        video.flags.toWatchLater &&
        channelsIds.includes(video.channelId) &&
        filterVideoByFlags(video, filters) &&
        (videosSeniority === VideosSeniority.Any ||
          elapsedDays(video.publishedAt) <= videosSeniority),
    ).length;
  },
);

export const selectSeenWatchLaterVideosCount = createSelector(
  selectVideos,
  selectChannelsByView(HomeView.WatchLater),
  (videos, channels) => {
    const channelsIds = channels.map(({ id }) => id);
    return videos.filter(
      ({ flags, channelId }) =>
        flags.toWatchLater && flags.seen && channelsIds.includes(channelId),
    ).length;
  },
);

export const selectVideoFlag = (video: Video, flag: VideoFlag) =>
  createSelector(selectVideos, (videos) => {
    const { flags } = videos.find(({ id }) => id === video.id) || {};
    return flags?.[flag] || false;
  });
