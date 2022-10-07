import type { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';
import { selectSettings } from './settings';

export const selectApp = (state: RootState) => state.app;

export const selectIsSetupRequired = createSelector(
  selectApp,
  selectSettings,
  (app, settings) => app.loaded && !settings.apiKey,
);
