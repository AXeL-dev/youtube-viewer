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
      ({ isViewed, channelId }) =>
        isViewed && (!channel || channel.id === channelId)
    )
  );

export const selectWatchLaterVideos = (channel?: Channel) =>
  createSelector(selectVideos, (videos) =>
    videos
      .filter(
        ({ isToWatchLater, channelId }) =>
          isToWatchLater && (!channel || channel.id === channelId)
      )
      .sort((a, b) => b.publishedAt - a.publishedAt)
  );

export const selectWatchLaterVideosCount = createSelector(
  selectVideos,
  selectHiddenChannels,
  (videos, hiddenChannels) => {
    const hiddenChannelsIds = hiddenChannels.map(({ id }) => id);
    return videos.filter(
      ({ isToWatchLater, channelId }) =>
        isToWatchLater && !hiddenChannelsIds.includes(channelId)
    ).length;
  }
);

export const selectViewedWatchLaterVideosCount = createSelector(
  selectVideos,
  selectHiddenChannels,
  (videos, hiddenChannels) => {
    const hiddenChannelsIds = hiddenChannels.map(({ id }) => id);
    return videos.filter(
      ({ isToWatchLater, isViewed, channelId }) =>
        isToWatchLater && isViewed && !hiddenChannelsIds.includes(channelId)
    ).length;
  }
);

export const selectVideoMeta = (video: Video) =>
  createSelector(selectVideos, (videos) => {
    const { isViewed = false, isToWatchLater = false } =
      videos.find(({ id }) => id === video.id) || {};
    return {
      isViewed,
      isToWatchLater,
    };
  });
