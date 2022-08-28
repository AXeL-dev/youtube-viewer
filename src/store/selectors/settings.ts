import type { RootState } from 'store';
import { createSelector } from 'reselect';
import {
  HomeView,
  ViewFilters,
  RecentViewFilters,
  WatchLaterViewFilters,
} from 'types';
import { defaultSettings } from 'store/reducers/settings';

export const selectSettings = (state: RootState) => state.settings;

export const selectMode = createSelector(selectSettings, (settings) =>
  settings.darkMode ? 'dark' : 'light',
);

export const selectViewFilters = (view: HomeView) =>
  createSelector(selectSettings, (settings): ViewFilters => {
    switch (view) {
      case HomeView.Recent:
        return {
          ...defaultSettings.recentViewFilters,
          ...settings.recentViewFilters,
        } as RecentViewFilters;
      case HomeView.WatchLater:
        return {
          ...defaultSettings.watchLaterViewFilters,
          ...settings.watchLaterViewFilters,
        } as WatchLaterViewFilters;
      default:
        return {} as ViewFilters;
    }
  });

export const selectHomeDisplayOptions = createSelector(
  selectSettings,
  (settings) => settings.homeDisplayOptions,
);

export const selectRecentVideosSeniority = createSelector(
  selectSettings,
  (settings) => settings.recentVideosSeniority,
);
