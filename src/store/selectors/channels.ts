import type { RootState } from '../store';

export const selectChannels = (state: RootState) => state.channels.list;

export const selectCurrentChannelIndex = (state: RootState) => state.channels.selectedChannelIndex;
