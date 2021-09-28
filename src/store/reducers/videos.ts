import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { elapsedDays } from 'helpers/utils';
import { isWebExtension } from 'helpers/webext';
import { Video } from 'types';
import { defaults as channelCheckerDefaults } from 'ui/components/webext/Background/ChannelChecker';

interface VideoOption {
  isViewed?: boolean;
  isToWatchLater?: boolean;
  isNotified?: boolean;
}

interface VideoItem extends VideoOption {
  id: string;
  channelId: string;
  publishedAt: number;
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
    addVideo: (
      state,
      action: PayloadAction<{ video: Video; option: VideoOption }>
    ) => {
      const { video, option } = action.payload;
      let found = state.list.find(({ id }) => id === video.id);
      if (found) {
        found = {
          ...found,
          ...option,
        };
      } else {
        state.list.push({
          id: video.id,
          channelId: video.channelId,
          publishedAt: video.publishedAt,
          ...option,
        });
      }
    },
    addViewedVideo: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const nextAction = {
        payload: { video, option: { isViewed: true } },
        type: action.type,
      };
      videosSlice.caseReducers.addVideo(state, nextAction);
    },
    addWatchLaterVideo: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const nextAction = {
        payload: { video, option: { isToWatchLater: true } },
        type: action.type,
      };
      videosSlice.caseReducers.addVideo(state, nextAction);
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
    clearWatchLaterList: (state) => {
      state.list = state.list.map((video) => ({
        ...video,
        isToWatchLater: !video.isViewed,
      }));
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
  addWatchLaterVideo,
  removeWatchLaterVideo,
  clearWatchLaterList,
  addNotifiedVideos,
  removeOutdatedVideos,
} = videosSlice.actions;

export default videosSlice.reducer;
