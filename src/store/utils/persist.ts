import store, { RootState } from 'store';
import storage from 'helpers/storage';
import { log } from 'helpers/logger';

export const storageKey = 'APP_YOUTUBE_VIEWER';

let canPersistState = true;
let prevSerializedState = '';

type DispatchParams = Parameters<typeof store.dispatch>;

export const dispatch = (
  action: DispatchParams[0],
  persist: boolean = false
) => {
  canPersistState = persist;
  store.dispatch(action);
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
