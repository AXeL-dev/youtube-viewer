import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Video } from 'types';

interface WatchLater {
  videoId: string;
  channelId: string;
  publishedAt: number;
}

interface VideosState {
  viewed: string[];
  watchLater: WatchLater[];
}

const initialState: VideosState = {
  viewed: [],
  watchLater: [],
};

export const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<VideosState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    addToWatchLaterList: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const found = state.watchLater.find(
        ({ videoId }) => videoId === video.id
      );
      if (!found) {
        state.watchLater.push({
          videoId: video.id,
          channelId: video.channelId,
          publishedAt: video.publishedAt,
        });
        state.watchLater = state.watchLater.sort(
          (a, b) => b.publishedAt - a.publishedAt
        );
      }
    },
    removeFromWatchLaterList: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      state.watchLater = state.watchLater.filter(
        ({ videoId }) => videoId !== video.id
      );
    },
    clearWatchLaterList: (state) => {
      const viewedIds = state.viewed.map((id) => id);
      state.watchLater = state.watchLater.filter(
        ({ videoId }) => !viewedIds.includes(videoId)
      );
    },
    addToViewedList: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const found = state.viewed.find((id) => id === video.id);
      if (!found) {
        state.viewed.push(video.id);
      }
      // videosSlice.caseReducers.removeFromWatchLaterList(state, action);
    },
  },
});

export const {
  setVideos,
  addToWatchLaterList,
  removeFromWatchLaterList,
  clearWatchLaterList,
  addToViewedList,
} = videosSlice.actions;

export default videosSlice.reducer;
