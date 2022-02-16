import type { RootState } from 'store';
import { createSelector } from 'reselect';
import { HomeView, ViewFilters } from 'types';

export const selectSettings = (state: RootState) => state.settings;

export const selectMode = createSelector(selectSettings, (settings) =>
  settings.darkMode ? 'dark' : 'light'
);

export const selectViewFilters = (view: HomeView) =>
  createSelector(selectSettings, (settings): ViewFilters => {
    switch (view) {
      case HomeView.Recent:
        return settings.recentViewFilters;
      case HomeView.WatchLater:
        return settings.watchLaterViewFilters;
      default:
        return {} as ViewFilters;
    }
  });
