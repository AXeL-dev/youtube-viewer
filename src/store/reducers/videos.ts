import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { elapsedDays } from 'helpers/utils';
import { isWebExtension } from 'helpers/webext';
import { Video } from 'types';
import { defaults as channelCheckerDefaults } from 'ui/components/webext/Background/ChannelChecker';

interface VideoItem {
  id: string;
  channelId: string;
  publishedAt: number;
  isViewed?: boolean;
  isToWatchLater?: boolean;
  isNotified?: boolean;
}

interface VideosState {
  list: VideoItem[];
}

const initialState: VideosState = {
  list: [],
};

export const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<Partial<VideosState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    addViewedVideo: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const found = state.list.find(({ id }) => id === video.id);
      if (found) {
        found.isViewed = true;
      } else {
        state.list.push({
          id: video.id,
          channelId: video.channelId,
          publishedAt: video.publishedAt,
          isViewed: true,
        });
      }
    },
    removeViewedVideo: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const found = state.list.find(({ id }) => id === video.id);
      if (found) {
        found.isViewed = false;
      }
    },
    addWatchLaterVideo: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const found = state.list.find(({ id }) => id === video.id);
      if (found) {
        found.isToWatchLater = true;
      } else {
        state.list.push({
          id: video.id,
          channelId: video.channelId,
          publishedAt: video.publishedAt,
          isToWatchLater: true,
        });
      }
    },
    removeWatchLaterVideo: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const found = state.list.find(({ id }) => id === video.id);
      if (found) {
        found.isToWatchLater = false;
      }
      if (!isWebExtension) {
        // no need to for the webextension, since it will be done by the background page on each launch
        videosSlice.caseReducers.removeOutdatedVideos(state);
      }
    },
    clearWatchLaterList: (
      state,
      action: PayloadAction<{ viewedOnly: boolean } | undefined>
    ) => {
      const { viewedOnly } = action.payload || {};
      state.list = state.list.map((video) =>
        video.isToWatchLater
          ? {
              ...video,
              isToWatchLater: viewedOnly ? !video.isViewed : false,
            }
          : video
      );
    },
    addNotifiedVideos: (state, action: PayloadAction<Video[]>) => {
      const videos = action.payload;
      for (const video of videos) {
        const found = state.list.find(({ id }) => id === video.id);
        if (found) {
          found.isNotified = true;
        } else {
          state.list.push({
            id: video.id,
            channelId: video.channelId,
            publishedAt: video.publishedAt,
            isNotified: true,
          });
        }
      }
    },
    removeOutdatedVideos: (state) => {
      state.list = state.list.filter(
        ({ isViewed, isToWatchLater, isNotified, publishedAt }) =>
          isViewed ||
          isToWatchLater ||
          (isNotified &&
            elapsedDays(publishedAt) <= channelCheckerDefaults.videosSeniority)
      );
    },
  },
});

export const {
  setVideos,
  addViewedVideo,
  removeViewedVideo,
  addWatchLaterVideo,
  removeWatchLaterVideo,
  clearWatchLaterList,
  addNotifiedVideos,
  removeOutdatedVideos,
} = videosSlice.actions;

export default videosSlice.reducer;
