import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { Channel, HomeView } from 'types';

export const selectChannels = (state: RootState) => state.channels.list;

export const selectChannelsByView = (view: HomeView) =>
  createSelector(selectChannels, (channels) => {
    switch (view) {
      case HomeView.All:
        return channels.filter(({ isHidden }) => !isHidden);
      default:
        return channels;
    }
  });

export const selectActiveChannels = createSelector(selectChannels, (channels) =>
  channels.filter(({ isHidden }) => !isHidden),
);

export const selectHiddenChannels = createSelector(selectChannels, (channels) =>
  channels.filter(({ isHidden }) => isHidden),
);

export const selectNotificationEnabledChannels = createSelector(
  selectChannels,
  (channels) =>
    channels.filter(
      ({ isHidden, notifications }) => !isHidden && !notifications?.isDisabled,
    ),
);

export const selectChannelsCountByView = (view: HomeView) =>
  createSelector(selectChannelsByView(view), (channels) => channels.length);

export const selectActiveChannelsCount = createSelector(
  selectActiveChannels,
  (channels) => channels.length,
);

export const selectChannelsCount = createSelector(
  selectChannels,
  selectActiveChannels,
  (channels, activeChannels) =>
    channels.length === activeChannels.length
      ? channels.length
      : `${activeChannels.length}/${channels.length}`,
);

export const selectChannel = (channel: Channel) =>
  createSelector(selectChannels, (channels) =>
    channels.find(({ id }) => id === channel.id),
  );
