import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Video, VideosCache, VideosSortOrder, ChannelSelection, SortOrder } from 'models';

export const defaultVideosSortOrder: SortOrder = SortOrder.DESC;

interface videosState {
  list: Video[];
  cache: VideosCache;
  sortOrder: VideosSortOrder;
}

const initialState: videosState = {
  list: [],
  cache: {},
  sortOrder: {
    [ChannelSelection.All]: SortOrder.DESC,
    [ChannelSelection.TodaysVideos]: SortOrder.DESC,
    [ChannelSelection.RecentVideos]: SortOrder.DESC,
    [ChannelSelection.WatchLaterVideos]: SortOrder.ASC,
  },
};

export const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.list = action.payload;
    },
    setVideosCache: (state, action: PayloadAction<VideosCache>) => {
      state.cache = action.payload;
    },
    setVideosSortOrder: (state, action: PayloadAction<VideosSortOrder>) => {
      state.sortOrder = action.payload;
    },
  },
});

export const { setVideos, setVideosCache, setVideosSortOrder } = videosSlice.actions;

export default videosSlice.reducer;
