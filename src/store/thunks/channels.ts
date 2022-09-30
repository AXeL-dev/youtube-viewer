import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { Channel } from 'types';
import { addChannel } from '../reducers/channels';
import { extendedApi } from '../services/youtube';

export const fetchChannelById = createAsyncThunk<
  Channel | undefined,
  { id: string },
  { state: RootState }
>('channels/fetchChannelById', async ({ id }, { dispatch }) => {
  const result = dispatch(
    extendedApi.endpoints.findChannelById.initiate({ id }),
  );
  result.unsubscribe();
  const response = await result;
  const channel = response.data?.items[0];

  return channel;
});

export const addChannelById = createAsyncThunk<
  void,
  { id: string },
  { state: RootState }
>('channels/addChannelById', async ({ id }, { getState, dispatch }) => {
  // check if channel exists
  const { channels } = getState();
  const found = channels.list.find((channel: Channel) => channel.id === id);
  if (found) {
    return;
  }

  // fetch channel by id
  const channel = await dispatch(fetchChannelById({ id })).unwrap();

  // save to channels list
  if (channel) {
    dispatch(addChannel(channel));
  }
});
