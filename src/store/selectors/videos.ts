import type { RootState } from '../store';

export const selectVideos = (state: RootState) => state.videos.list;

export const selectVideosCache = (state: RootState) => state.videos.cache;

export const selectVideosSortOrder = (state: RootState) => state.videos.sortOrder;
