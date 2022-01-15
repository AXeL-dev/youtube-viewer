import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { elapsedDays } from 'helpers/utils';
import { isWebExtension } from 'helpers/webext';
import { VideoCache, Video, VideoFlags } from 'types';
import { defaults as channelCheckerDefaults } from 'ui/components/webext/Background/ChannelChecker';

interface VideosState {
  list: VideoCache[];
}

const initialState: VideosState = {
  list: [],
};

function addVideo(
  state: VideosState,
  video: Video,
  flags: Partial<VideoFlags>
) {
  const found = state.list.find(({ id }) => id === video.id);
  if (found) {
    found.flags = {
      ...found.flags,
      ...flags,
    };
  } else {
    state.list.push({
      id: video.id,
      channelId: video.channelId,
      publishedAt: video.publishedAt,
      flags,
    });
  }
}

function removeVideoFlag(
  state: VideosState,
  video: Video,
  flag: keyof VideoFlags
) {
  const found = state.list.find(({ id }) => id === video.id);
  if (found) {
    found.flags[flag] = false;
  }
}

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
      addVideo(state, video, { viewed: true });
    },
    removeViewedVideo: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      removeVideoFlag(state, video, 'viewed');
    },
    addWatchLaterVideo: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      addVideo(state, video, { toWatchLater: true });
    },
    removeWatchLaterVideo: (state, action: PayloadAction<Video>) => {
      const video = action.payload;
      removeVideoFlag(state, video, 'toWatchLater');
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
        video.flags.toWatchLater
          ? {
              ...video,
              flags: {
                ...video.flags,
                toWatchLater: viewedOnly ? !video.flags.viewed : false,
              },
            }
          : video
      );
    },
    addCheckedVideos: (state, action: PayloadAction<Video[]>) => {
      const videos = action.payload;
      for (const video of videos) {
        addVideo(state, video, { checked: true });
      }
    },
    removeOutdatedVideos: (state) => {
      state.list = state.list.filter(
        ({ flags, publishedAt }) =>
          flags.viewed ||
          flags.toWatchLater ||
          (flags.checked &&
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
  addCheckedVideos,
  removeOutdatedVideos,
} = videosSlice.actions;

export default videosSlice.reducer;
