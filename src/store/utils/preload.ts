import storage from 'helpers/storage';
import { setSettings } from '../reducers/settings';
import { setChannels } from '../reducers/channels';
import { setVideos } from '../reducers/videos';
import { setApp } from '../reducers/app';
import { dispatch, storageKey } from './persist';

export const preloadState = async () => {
  const state = await storage.get(storageKey);
  let shouldPersist = !state;
  if (state) {
    // Load stored data
    const { settings, channels, videos } = state;
    if (settings) {
      dispatch(setSettings(settings));
    }
    if (channels) {
      dispatch(setChannels(channels));
    }
    if (videos) {
      dispatch(setVideos(videos));
    }
  }
  dispatch(setApp({ loaded: true }), shouldPersist);
};