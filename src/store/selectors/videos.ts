import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { Channel, Video } from 'types';
import { selectHiddenChannels } from './channels';

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

export const selectCheckedVideos = (channel?: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos.filter(
      ({ flags, channelId }) =>
        flags.checked && (!channel || channel.id === channelId)
    )
  );

export const selectWatchLaterVideos = (channel?: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos
      .filter(
        ({ flags, channelId }) =>
          flags.toWatchLater && (!channel || channel.id === channelId)
      )
      .sort((a, b) => b.publishedAt - a.publishedAt)
  );

export const selectWatchLaterVideosCount = createSelector(
  selectVideos,
  selectHiddenChannels,
  (videos, hiddenChannels) => {
    const hiddenChannelsIds = hiddenChannels.map(({ id }) => id);
    return videos.filter(
      ({ flags, channelId }) =>
        flags.toWatchLater && !hiddenChannelsIds.includes(channelId)
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
    };
  });
