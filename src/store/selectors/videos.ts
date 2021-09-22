import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { Channel, Video } from 'types';

const selectVideos = (state: RootState) => state.videos;

export const selectViewedVideos = createSelector(
  selectVideos,
  (videos) => videos.viewed
);

export const selectWatchLaterVideos = (channel?: Channel) =>
  createSelector(selectVideos, (videos) =>
    channel
      ? videos.watchLater.filter(({ channelId }) => channelId === channel.id)
      : videos.watchLater
  );

export const selectWatchLaterVideosCount = createSelector(
  selectVideos,
  (videos) => videos.watchLater.length
);

export const selectVideoMeta = (video: Video) =>
  createSelector(selectVideos, (videos) => ({
    isViewed: !!videos.viewed.find((id) => id === video.id),
    isToWatchLater: !!videos.watchLater.find(
      ({ videoId }) => videoId === video.id
    ),
  }));
