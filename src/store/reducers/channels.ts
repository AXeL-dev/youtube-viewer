import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { arrayMove } from '@dnd-kit/sortable';
import { Channel, ChannelFilter } from 'types';

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
    setChannels: (state, action: PayloadAction<Partial<ChannelsState>>) => {
      return {
        ...state,
        ...action.payload,
      };
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
      action: PayloadAction<{ from: number; to: number }>,
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
    setChannelFilters: (
      state,
      action: PayloadAction<{
        channel: Channel;
        filters: ChannelFilter[];
      }>,
    ) => {
      const {
        channel: { id },
        filters,
      } = action.payload;
      const found = state.list.find((channel: Channel) => channel.id === id);
      if (found) {
        found.filters = filters;
      }
    },
    mergeChannels: (state, action: PayloadAction<Channel[]>) => {
      const channelIds = state.list.map((channel) => channel.id);
      state.list = [
        ...state.list,
        ...action.payload.filter((channel) => !channelIds.includes(channel.id)),
      ];
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
  setChannelFilters,
  mergeChannels,
} = channelsSlice.actions;

export default channelsSlice.reducer;
