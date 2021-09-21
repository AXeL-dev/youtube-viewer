import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { Video } from 'types';

const selectVideos = (state: RootState) => state.videos;

export const selectWatchedVideos = (state: RootState) => state.videos.watched;

export const selectWatchLaterVideos = (state: RootState) =>
  state.videos.watchLater;

export const selectVideoMeta = (video: Video) =>
  createSelector(selectVideos, (videos) => ({
    isWatched: !!videos.watched.find((id: string) => id === video.id),
    isToWatchLater: !!videos.watchLater.find((id: string) => id === video.id),
  }));
