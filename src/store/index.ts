import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import settingsReducer, { setSettings } from './reducers/settings';
import channelsReducer, { setChannels } from './reducers/channels';
import storage from 'helpers/storage';
import { debounce } from 'helpers/utils';
import { youtubeApi } from './services/youtube';

const stateKey = 'APP_YOUTUBE_VIEWER';
const store = configureStore({
  reducer: {
    settings: settingsReducer,
    channels: channelsReducer,
    [youtubeApi.reducerPath]: youtubeApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(youtubeApi.middleware),
});

store.subscribe(
  debounce(() => {
    const { settings, channels } = store.getState();
    storage.save({
      [stateKey]: {
        settings,
        channels,
      },
    });
  }, 1000)
);

(async () => {
  const { settings, channels } = (await storage.get(stateKey)) || {};
  if (!settings && !channels) {
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
    if (settings) {
      store.dispatch(setSettings(settings));
    }
    if (channels) {
      store.dispatch(setChannels(channels.list));
    }
  }
  // ToDo: the above dispatch(s) triggers a state save into the storage (this should be avoided)
})();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
