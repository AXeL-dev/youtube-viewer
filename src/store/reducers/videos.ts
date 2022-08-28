import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoCache, Video, VideoFlags, VideoFlag } from 'types';

type VideoWithId = Pick<VideoCache, 'id'>;
type AddVideoPayload = Video | Omit<VideoCache, 'flags'>;
type RemoveVideoPayload = Video | VideoWithId;

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
    addVideoFlag: (
      state,
      action: PayloadAction<{
        video: AddVideoPayload;
        flag: VideoFlag;
      }>,
    ) => {
      const { video, flag } = action.payload;
      addVideo({
        state,
        video,
        flags: { [flag]: true },
      });
    },
    removeVideoFlag: (
      state,
      action: PayloadAction<{
        video: RemoveVideoPayload;
        flag: VideoFlag;
      }>,
    ) => {
      const { video, flag } = action.payload;
      setVideoFlags({
        state,
        video,
        flags: { [flag]: false },
      });
    },
    clearWatchLaterList: (
      state,
      action: PayloadAction<{ viewedOnly: boolean } | undefined>,
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
          : video,
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
      action: PayloadAction<Exclude<VideoFlag, 'archived'>>,
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
          : video,
      );
    },
    setVideosFlag: (
      state,
      action: PayloadAction<{
        videos: VideoWithId[];
        flag: VideoFlag;
        value?: boolean;
      }>,
    ) => {
      const { videos, flag, value = true } = action.payload;
      const targetIds = videos.map(({ id }) => id);
      state.list = state.list.map((video) =>
        targetIds.includes(video.id)
          ? {
              ...video,
              flags: {
                ...video.flags,
                [flag]: value,
              },
            }
          : video,
      );
    },
    saveVideos: (
      state,
      action: PayloadAction<{
        videos: Video[];
        flags: VideoFlags;
      }>,
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
  },
});

export const {
  setVideos,
  addVideoFlag,
  removeVideoFlag,
  clearWatchLaterList,
  archiveVideo,
  unarchiveVideo,
  archiveVideosByFlag,
  setVideosFlag,
  saveVideos,
} = videosSlice.actions;

export default videosSlice.reducer;
