import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { Channel, Video } from 'types';

export const selectVideos = (channel?: Channel) => (state: RootState) =>
  channel
    ? state.videos.list.filter(({ channelId }) => channel.id === channelId)
    : state.videos.list;

export const selectViewedVideos = (channel?: Channel) =>
  createSelector(selectVideos(channel), (videos) =>
    videos.filter(({ isViewed }) => isViewed)
  );

export const selectWatchLaterVideos = (channel?: Channel) =>
  createSelector(selectVideos(channel), (videos) =>
    videos
      .filter(({ isToWatchLater }) => isToWatchLater)
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
  createSelector(selectVideos(), (videos) => {
    const { isViewed = false, isToWatchLater = false } =
      videos.find(({ id }) => id === video.id) || {};
    return {
      isViewed,
      isToWatchLater,
    };
  });
