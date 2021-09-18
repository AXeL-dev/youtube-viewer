import type { RootState } from 'store';
import { createSelector } from 'reselect';
import { Settings } from 'types';

export const selectSettings = (state: RootState) => state.settings;

export const selectMode = createSelector(selectSettings, (settings: Settings) =>
  settings.darkMode ? 'dark' : 'light'
);
