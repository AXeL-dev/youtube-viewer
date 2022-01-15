import store, { RootState } from 'store';
import storage from 'helpers/storage';
import { setSettings } from './reducers/settings';
import { setChannels } from './reducers/channels';
import { setVideos } from './reducers/videos';
import { setApp } from './reducers/app';
import { AnyAction } from '@reduxjs/toolkit';
import { log } from 'helpers/logger';
import { LegacyVideoCache } from 'types';

export const storageKey = 'APP_YOUTUBE_VIEWER';

let canPersistState = true;
let prevSerializedState = '';

export const dispatch = (action: AnyAction, persist: boolean = false) => {
  canPersistState = persist;
  store.dispatch(action);
};

export const preloadState = async () => {
  const state = await storage.get(storageKey);
  let shouldPersist = !state;
  if (!state) {
    // Handle backward compatibility with v0.6.x
    const legacy = (await storage.get('settings', 'channels')) || {};
    if (legacy.settings) {
      const { apiKey } = legacy.settings;
      if (apiKey) {
        dispatch(setSettings({ apiKey }));
      }
    }
    if (legacy.channels) {
      dispatch(setChannels({ list: legacy.channels }));
    }
  } else {
    // Load stored data
    const { settings, channels, videos } = state || {};
    if (settings) {
      dispatch(setSettings(settings));
    }
    if (channels) {
      dispatch(setChannels(channels));
    }
    if (videos) {
      // Handle legacy videos cache
      const legacyVideos = videos.list.filter(
        (video: LegacyVideoCache) =>
          !!Object.keys(video).find((key) =>
            ['isViewed', 'isToWatchLater', 'isNotified'].includes(key)
          )
      );
      if (legacyVideos.length > 0) {
        shouldPersist = true;
        dispatch(
          setVideos({
            list: videos.list.map(
              ({
                isViewed,
                isToWatchLater,
                isNotified,
                ...video
              }: LegacyVideoCache) => ({
                ...video,
                flags: {
                  viewed: isViewed || false,
                  toWatchLater: isToWatchLater || false,
                  checked: isNotified || false,
                },
              })
            ),
          })
        );
      } else {
        dispatch(setVideos(videos));
      }
    }
  }
  dispatch(setApp({ loaded: true }), shouldPersist);
};

export const persistState = (state: RootState, onlyIfChanged?: boolean) => {
  log('Persist state:', {
    canPersistState,
    state,
  });
  if (!canPersistState) {
    canPersistState = true;
    return;
  }
  const { settings, channels, videos } = state;
  if (onlyIfChanged) {
    const serializedState = JSON.stringify({ settings, channels, videos });
    if (prevSerializedState === serializedState) {
      log('State did not change!');
      return;
    }
    prevSerializedState = serializedState;
  }
  storage.save({
    [storageKey]: {
      settings,
      channels,
      videos,
    },
  });
};
