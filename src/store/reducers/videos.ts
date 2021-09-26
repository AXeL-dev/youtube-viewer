import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Video } from 'types';

interface VideoItem {
  id: string;
  channelId: string;
  publishedAt: number;
  isViewed?: boolean;
  isToWatchLater?: boolean;
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
    removeVideosGarbage: (state) => {
      state.list = state.list.filter(
        ({ isViewed, isToWatchLater }) => isViewed || isToWatchLater
      );
    },
    addToWatchLaterList: (state, action: PayloadAction<Video>) => {
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
    removeFromWatchLaterList: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const found = state.list.find(({ id }) => id === video.id);
      if (found) {
        found.isToWatchLater = false;
      }
      videosSlice.caseReducers.removeVideosGarbage(state);
    },
    clearWatchLaterList: (state) => {
      state.list = state.list.map((video) => ({
        ...video,
        isToWatchLater: !video.isViewed,
      }));
    },
    addToViewedList: (state, action: PayloadAction<Video>) => {
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
  },
});

export const {
  setVideos,
  removeVideosGarbage,
  addToWatchLaterList,
  removeFromWatchLaterList,
  clearWatchLaterList,
  addToViewedList,
} = videosSlice.actions;

export default videosSlice.reducer;
