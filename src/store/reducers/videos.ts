import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoCache, Video, VideoFlags, VideoFlag, Channel } from 'types';

type VideoWithId = Pick<VideoCache, 'id'>;
type AddVideoPayload = Video | Omit<VideoCache, 'flags'>;
type RemoveVideoPayload = Video | VideoWithId;

interface VideosState {
  list: VideoCache[];
}

const initialState: VideosState = {
  list: [],
};

interface PersistVideoParams {
  state: VideosState;
  video: AddVideoPayload;
  flags: VideoFlags;
}

function persistVideo({ state, video, flags }: PersistVideoParams) {
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
    addVideo: (
      state,
      action: PayloadAction<{
        video: AddVideoPayload;
        flags?: VideoFlags;
      }>,
    ) => {
      const { video, flags = {} } = action.payload;
      persistVideo({
        state,
        video,
        flags,
      });
    },
    addVideoFlag: (
      state,
      action: PayloadAction<{
        video: AddVideoPayload;
        flag: VideoFlag;
      }>,
    ) => {
      const { video, flag } = action.payload;
      persistVideo({
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
      action: PayloadAction<{ seenOnly: boolean } | undefined>,
    ) => {
      const { seenOnly } = action.payload || {};
      state.list = state.list.map((video) =>
        video.flags.toWatchLater
          ? {
              ...video,
              flags: {
                ...video.flags,
                toWatchLater: seenOnly ? !video.flags.seen : false,
              },
            }
          : video,
      );
    },
    clearBookmarksList: (state) => {
      state.list = state.list.map((video) =>
        video.flags.bookmarked
          ? {
              ...video,
              flags: {
                ...video.flags,
                bookmarked: false,
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
        persistVideo({
          state,
          video,
          flags,
        });
      }
    },
    removeChannelVideos: (state, action: PayloadAction<Channel>) => {
      const { id: channelId } = action.payload;
      state.list = state.list.filter((video) => video.channelId !== channelId);
    },
  },
});

export const {
  setVideos,
  addVideo,
  addVideoFlag,
  removeVideoFlag,
  clearWatchLaterList,
  clearBookmarksList,
  archiveVideo,
  unarchiveVideo,
  archiveVideosByFlag,
  setVideosFlag,
  saveVideos,
  removeChannelVideos,
} = videosSlice.actions;

export default videosSlice.reducer;
