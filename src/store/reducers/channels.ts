import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Channel, ChannelSelection } from 'models';

interface channelsState {
  list: Channel[];
  selectedChannelIndex: ChannelSelection;
}

const initialState: channelsState = {
  list: [],
  selectedChannelIndex: ChannelSelection.All,
};

export const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.list = action.payload;
    },
    setSelectedChannelIndex: (state, action: PayloadAction<ChannelSelection>) => {
      state.selectedChannelIndex = action.payload;
    },
  },
});

export const { setChannels, setSelectedChannelIndex } = channelsSlice.actions;

export default channelsSlice.reducer;
