import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import settingsReducer, { setSettings } from './reducers/settings';
import channelsReducer, { setChannels } from './reducers/channels';
import videosReducer, { setVideos } from './reducers/videos';
import storage from 'helpers/storage';
import { debounce } from 'helpers/utils';
import { youtubeApi } from './services/youtube';
import { isBackgroundPageRunning } from 'ui/components/webext';

export const stateKey = 'APP_YOUTUBE_VIEWER';
const store = configureStore({
  reducer: {
    settings: settingsReducer,
    channels: channelsReducer,
    videos: videosReducer,
    [youtubeApi.reducerPath]: youtubeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(youtubeApi.middleware),
});

store.subscribe(
  debounce(() => {
    if (isBackgroundPageRunning) {
      return;
    }
    const { settings, channels, videos } = store.getState();
    storage.save({
      [stateKey]: {
        settings,
        channels,
        videos,
      },
    });
  }, 1000)
);

(async () => {
  const { settings, channels, videos } = (await storage.get(stateKey)) || {};
  if (!settings && !channels) {
    // Handle backward compatibility with v0.6.x
    const legacy = (await storage.get('settings', 'channels')) || {};
    store.dispatch(
      setSettings({
        ...(legacy.settings ? { apiKey: legacy.settings.apiKey } : {}),
        _loaded: true,
      })
    );
    if (legacy.channels) {
      store.dispatch(setChannels(legacy.channels));
    }
  } else {
    // Load stored data
    store.dispatch(
      setSettings({
        ...(settings || {}),
        _loaded: true,
      })
    );
    if (channels) {
      store.dispatch(setChannels(channels.list));
    }
    if (videos) {
      store.dispatch(setVideos(videos));
    }
    // ToDo: the above 3 dispatch(s) triggers a state save into the storage (this should be avoided)
  }
})();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
