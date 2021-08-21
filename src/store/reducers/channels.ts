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
    hideChannel: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.list[index].isHidden = true;
    },
    unhideChannel: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.list[index].isHidden = false;
    },
  },
});

export const { setChannels, setSelectedChannelIndex, hideChannel, unhideChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
