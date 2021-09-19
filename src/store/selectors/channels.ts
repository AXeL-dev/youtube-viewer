import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from 'store';
import { Channel } from 'types';

export const selectChannels = (state: RootState) => state.channels.list;

export const selectChannelsCount = createSelector(
  selectChannels,
  (channels) => channels.length
);

export const selectChannel = (channel: Channel) =>
  createSelector(selectChannels, (channels) =>
    channels.find((c: Channel) => c.id === channel.id)
  );
