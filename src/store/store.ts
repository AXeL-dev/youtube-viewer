import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './reducers/channels';
import settingsReducer from './reducers/settings';
import snackbarReducer from './reducers/snackbar';
import videosReducer from './reducers/videos';

export const store = configureStore({
  reducer: {
    channels: channelsReducer,
    settings: settingsReducer,
    snackbar: snackbarReducer,
    videos: videosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
