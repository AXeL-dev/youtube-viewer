import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Channel } from 'types';

interface channelsState {
  list: Channel[];
}

const initialState: channelsState = {
  list: [],
};

export const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.list = action.payload;
    },
    addChannel: (state, action: PayloadAction<Channel>) => {
      const { id } = action.payload;
      const found = state.list.find((channel: Channel) => channel.id === id);
      if (!found) {
        state.list.push(action.payload);
      }
    },
    removeChannel: (state, action: PayloadAction<Channel>) => {
      const { id } = action.payload;
      state.list = state.list.filter((channel: Channel) => channel.id !== id);
    },
  },
});

export const { setChannels, addChannel, removeChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
