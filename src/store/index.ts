import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import settingsReducer from './reducers/settings';
import channelsReducer from './reducers/channels';
import videosReducer from './reducers/videos';
import appReducer from './reducers/app';
import { debounce } from 'helpers/utils';
import { youtubeApi } from './services/youtube';
import { preloadState, persistState } from './utils';

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    channels: channelsReducer,
    videos: videosReducer,
    app: appReducer,
    [youtubeApi.reducerPath]: youtubeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(youtubeApi.middleware),
});

store.subscribe(
  debounce(() => {
    persistState(store.getState());
  }, 1000)
);

(async () => await preloadState())();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { storageKey, dispatch } from './utils';

export default store;
