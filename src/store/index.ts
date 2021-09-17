import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import settingsReducer, { setSettings } from './reducers/settings';
import storage from 'helpers/storage';
import { debounce } from 'helpers/utils';

const stateKey = 'APP_YOUTUBE_VIEWER';
const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});

store.subscribe(
  debounce(() => {
    const { settings } = store.getState();
    storage.save({
      [stateKey]: {
        settings,
      },
    });
  }, 1000)
);

(async () => {
  const { settings } = (await storage.get(stateKey)) || {};
  if (settings) {
    store.dispatch(setSettings(settings));
  }
})();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
