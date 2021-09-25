import store, { RootState } from 'store';
import storage from 'helpers/storage';
import { isBackgroundPageRunning } from 'ui/components/webext';
import { setSettings } from './reducers/settings';
import { setChannels } from './reducers/channels';
import { setVideos } from './reducers/videos';
import { setApp } from './reducers/app';

export const storageKey = 'APP_YOUTUBE_VIEWER';

let ignoreNextStatePersist = false;

export const preloadState = async () => {
  const state = await storage.get(storageKey);
  if (!state) {
    // Handle backward compatibility with v0.6.x
    const legacy = (await storage.get('settings', 'channels')) || {};
    if (legacy.settings) {
      const { apiKey } = legacy.settings;
      store.dispatch(setSettings({ apiKey }));
    }
    if (legacy.channels) {
      store.dispatch(setChannels(legacy.channels));
    }
  } else {
    // Load stored data
    const { settings, channels, videos } = state || {};
    if (settings) {
      store.dispatch(setSettings(settings));
    }
    if (channels) {
      store.dispatch(setChannels(channels.list));
    }
    if (videos) {
      store.dispatch(setVideos(videos));
    }
    ignoreNextStatePersist = !!state;
  }
  store.dispatch(setApp({ loaded: true }));
};

export const persistState = (state: RootState) => {
  const ignore =
    !state.app.loaded || isBackgroundPageRunning || ignoreNextStatePersist;
  // console.log('Persist state:', !ignore, {
  //   state,
  //   isBackgroundPageRunning,
  //   ignoreNextStatePersist,
  // });
  if (ignore) {
    ignoreNextStatePersist = false;
    return;
  }
  const { settings, channels, videos } = state;
  storage.save({
    [storageKey]: {
      settings,
      channels,
      videos,
    },
  });
};
