import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { Video, VideoCache, VideoFlags } from 'types';
import { addVideo } from '../reducers/videos';
import { extendedApi, GetVideosByIdArgs } from '../services/youtube';
import { addChannelById } from './channels';

export const fetchVideosById = createAsyncThunk<
  Video[],
  GetVideosByIdArgs,
  { state: RootState }
>('videos/fetchVideosById', async (payload, { dispatch }) => {
  const result = dispatch(
    extendedApi.endpoints.getVideosById.initiate(payload),
  );
  result.unsubscribe();
  const response = await result;
  const videos = response.data?.items || [];

  return videos;
});

export const addVideoById = createAsyncThunk<
  void,
  { id: string; flags?: VideoFlags; hideChannel?: boolean },
  { state: RootState }
>(
  'videos/addVideoById',
  async ({ id, flags, hideChannel }, { getState, dispatch }) => {
    // check if video exists
    const { videos } = getState();
    let video: Video | VideoCache | undefined = videos.list.find(
      (video) => video.id === id,
    );

    if (!video) {
      // fetch video by id
      const result = await dispatch(
        fetchVideosById({ ids: [id], maxResults: 1 }),
      ).unwrap();
      video = result[0];
    }

    // save to videos list
    if (video) {
      dispatch(
        addVideo({
          video,
          flags,
        }),
      );
      // ensure to add channel too (if it does not exist)
      dispatch(addChannelById({ id: video.channelId, hide: hideChannel }));
    }
  },
);
