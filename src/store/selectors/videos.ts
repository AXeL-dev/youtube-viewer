import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { Channel, Video } from 'types';

const selectVideos = (state: RootState) => state.videos.list;

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

export const selectWatchLaterVideosCount = (state: RootState) => {
  const hiddenChannels = state.channels.list
    .filter((channel) => channel.isHidden)
    .map(({ id }) => id);
  return state.videos.list.filter(
    ({ isToWatchLater, channelId }) =>
      isToWatchLater && !hiddenChannels.includes(channelId)
  ).length;
};

export const selectViewedWatchLaterVideosCount = (state: RootState) => {
  const hiddenChannels = state.channels.list
    .filter((channel) => channel.isHidden)
    .map(({ id }) => id);
  return state.videos.list.filter(
    ({ isToWatchLater, isViewed, channelId }) =>
      isToWatchLater && isViewed && !hiddenChannels.includes(channelId)
  ).length;
};

export const selectVideoMeta = (video: Video) =>
  createSelector(selectVideos, (videos) => {
    const { isViewed = false, isToWatchLater = false } =
      videos.find(({ id }) => id === video.id) || {};
    return {
      isViewed,
      isToWatchLater,
    };
  });
