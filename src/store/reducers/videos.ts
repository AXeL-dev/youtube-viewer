import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Video } from 'types';

interface VideosState {
  watched: string[];
  watchLater: string[];
}

const initialState: VideosState = {
  watched: [],
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
      const found = state.watchLater.find((id: string) => id === video.id);
      if (!found) {
        state.watchLater.push(video.id);
      }
    },
    removeFromWatchLaterList: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      state.watchLater = state.watchLater.filter(
        (id: string) => id !== video.id
      );
    },
    markVideoAsWatched: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      const found = state.watched.find((id: string) => id === video.id);
      if (!found) {
        state.watched.push(video.id);
      }
      state.watchLater = state.watchLater.filter(
        (id: string) => id !== video.id
      );
    },
  },
});

export const {
  setVideos,
  addToWatchLaterList,
  removeFromWatchLaterList,
  markVideoAsWatched,
} = videosSlice.actions;

export default videosSlice.reducer;
