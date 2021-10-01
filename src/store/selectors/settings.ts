import type { RootState } from 'store';
import { createSelector } from 'reselect';

export const selectSettings = (state: RootState) => state.settings;

export const selectMode = createSelector(selectSettings, (settings) =>
  settings.darkMode ? 'dark' : 'light'
);
