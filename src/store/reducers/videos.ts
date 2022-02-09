import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { elapsedDays } from 'helpers/utils';
import { isWebExtension } from 'helpers/webext';
import { VideoCache, Video, VideoFlags, VideoFlag } from 'types';
import { defaults as channelCheckerDefaults } from 'ui/components/webext/Background/ChannelChecker';

type AddVideoPayload = Omit<VideoCache, 'flags'>;
type RemoveVideoPayload = Pick<VideoCache, 'id'>;

interface VideosState {
  list: VideoCache[];
}

const initialState: VideosState = {
  list: [],
};

function addVideo(
  state: VideosState,
  video: Video | AddVideoPayload,
  flags: VideoFlags
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
  video: Video | RemoveVideoPayload,
  flag: VideoFlag
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
    addViewedVideo: (state, action: PayloadAction<Video | AddVideoPayload>) => {
      const video = action.payload;
      addVideo(state, video, { viewed: true });
    },
    removeViewedVideo: (
      state,
      action: PayloadAction<Video | RemoveVideoPayload>
    ) => {
      const video = action.payload;
      removeVideoFlag(state, video, 'viewed');
    },
    addWatchLaterVideo: (
      state,
      action: PayloadAction<Video | AddVideoPayload>
    ) => {
      const video = action.payload;
      addVideo(state, video, { toWatchLater: true });
    },
    removeWatchLaterVideo: (
      state,
      action: PayloadAction<Video | RemoveVideoPayload>
    ) => {
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
    saveVideos: (
      state,
      action: PayloadAction<{ videos: Video[]; flags: VideoFlags }>
    ) => {
      const { videos, flags } = action.payload;
      for (const video of videos) {
        addVideo(state, video, flags);
      }
    },
    removeOutdatedVideos: (state) => {
      state.list = state.list.filter(
        ({ flags, publishedAt }) =>
          flags.viewed ||
          flags.toWatchLater ||
          ((flags.notified || flags.recent) &&
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
  saveVideos,
  removeOutdatedVideos,
} = videosSlice.actions;

export default videosSlice.reducer;
