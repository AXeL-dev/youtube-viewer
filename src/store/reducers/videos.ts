import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { elapsedDays } from 'helpers/utils';
import { isWebExtension } from 'helpers/webext';
import { VideoCache, Video, VideoFlags, VideoFlag } from 'types';
import { defaults as channelCheckerDefaults } from 'ui/components/webext/Background/ChannelChecker';

type AddVideoPayload = Video | Omit<VideoCache, 'flags'>;
type RemoveVideoPayload = Video | Pick<VideoCache, 'id'>;

interface VideosState {
  list: VideoCache[];
}

const initialState: VideosState = {
  list: [],
};

interface AddVideoParams {
  state: VideosState;
  video: AddVideoPayload;
  flags: VideoFlags;
}

function addVideo({ state, video, flags }: AddVideoParams) {
  const found = setVideoFlags({
    state,
    video,
    flags,
  });
  if (!found) {
    state.list.push({
      id: video.id,
      channelId: video.channelId,
      publishedAt: video.publishedAt,
      flags,
    });
  }
}

interface SetVideoFlagsParams {
  state: VideosState;
  video: AddVideoPayload | RemoveVideoPayload;
  flags: VideoFlags;
  filter?: (video: VideoCache) => boolean;
}

function setVideoFlags({
  state,
  video,
  flags,
  filter = () => true,
}: SetVideoFlagsParams) {
  const found = state.list.find(({ id }) => id === video.id);
  if (found && filter(found)) {
    found.flags = {
      ...found.flags,
      ...flags,
    };
  }
  return found;
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
    addViewedVideo: (state, action: PayloadAction<AddVideoPayload>) => {
      const video = action.payload;
      addVideo({
        state,
        video,
        flags: { viewed: true },
      });
    },
    removeViewedVideo: (state, action: PayloadAction<RemoveVideoPayload>) => {
      const video = action.payload;
      setVideoFlags({
        state,
        video,
        flags: { viewed: false },
      });
    },
    addWatchLaterVideo: (state, action: PayloadAction<AddVideoPayload>) => {
      const video = action.payload;
      addVideo({
        state,
        video,
        flags: { toWatchLater: true },
      });
    },
    removeWatchLaterVideo: (
      state,
      action: PayloadAction<RemoveVideoPayload>
    ) => {
      const video = action.payload;
      setVideoFlags({
        state,
        video,
        flags: { toWatchLater: false },
      });
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
    archiveVideo: (state, action: PayloadAction<AddVideoPayload>) => {
      const video = action.payload;
      setVideoFlags({
        state,
        video,
        flags: { archived: true },
        filter: (video) => video.flags.toWatchLater === true,
      });
    },
    unarchiveVideo: (state, action: PayloadAction<RemoveVideoPayload>) => {
      const video = action.payload;
      setVideoFlags({
        state,
        video,
        flags: { archived: false },
        filter: (video) => video.flags.toWatchLater === true,
      });
    },
    archiveVideosByFlag: (
      state,
      action: PayloadAction<Exclude<VideoFlag, 'archived'>>
    ) => {
      const flag = action.payload;
      state.list = state.list.map((video) =>
        Object.keys(video.flags || {}).includes(flag)
          ? {
              ...video,
              flags: {
                ...video.flags,
                archived: true,
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
        addVideo({
          state,
          video,
          flags,
        });
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
  archiveVideo,
  unarchiveVideo,
  archiveVideosByFlag,
  saveVideos,
  removeOutdatedVideos,
} = videosSlice.actions;

export default videosSlice.reducer;
