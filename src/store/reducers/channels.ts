import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { arrayMove } from '@dnd-kit/sortable';
import { Channel } from 'types';

interface ChannelsState {
  list: Channel[];
}

const initialState: ChannelsState = {
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
    moveChannel: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      state.list = arrayMove(state.list, from, to);
    },
    toggleChannel: (state, action: PayloadAction<Channel>) => {
      const { id } = action.payload;
      const found = state.list.find((channel: Channel) => channel.id === id);
      if (found) {
        found.isHidden = !found.isHidden;
      }
    },
    toggleChannelNotifications: (state, action: PayloadAction<Channel>) => {
      const { id } = action.payload;
      const found = state.list.find((channel: Channel) => channel.id === id);
      if (found) {
        found.notifications = {
          ...found.notifications,
          isDisabled: found.notifications
            ? !found.notifications.isDisabled
            : true,
        };
      }
    },
  },
});

export const {
  setChannels,
  addChannel,
  removeChannel,
  moveChannel,
  toggleChannel,
  toggleChannelNotifications,
} = channelsSlice.actions;

export default channelsSlice.reducer;
