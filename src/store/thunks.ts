import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { Channel } from 'types';
import { addChannel } from './reducers/channels';
import { extendedApi } from './services/youtube';

export const fetchChannelById = createAsyncThunk<
  Channel | undefined,
  { id: string },
  { state: RootState }
>('channels/fetchChannelById', async ({ id }, { getState, dispatch }) => {
  const { channels } = getState();
  // check for existing channel
  const found = channels.list.find((channel: Channel) => channel.id === id);
  if (found) {
    return found;
  }

  // fetch channel by id
  const result = dispatch(
    extendedApi.endpoints.findChannelById.initiate({ id }),
  );
  result.unsubscribe();
  const response = await result;
  const channel = response.data?.items[0];
  if (channel) {
    // save to channels list
    dispatch(addChannel(channel));
  }
  return channel;
});
