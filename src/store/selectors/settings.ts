import type { RootState } from 'store';
import { createSelector } from 'reselect';
import {
  HomeView,
  ViewFilters,
  RecentViewFilters,
  WatchLaterViewFilters,
  ExtraVideoAction,
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

export const selectActiveViewFiltersCount = (view: HomeView) =>
  createSelector(
    selectViewFilters(view),
    (filters) => Object.values(filters).filter(Boolean).length,
  );

export const selectViewSorting = (view: HomeView) =>
  createSelector(selectSettings, (settings) => {
    switch (view) {
      case HomeView.Recent:
        return {
          ...defaultSettings.recentViewSorting,
          ...settings.recentViewSorting,
        };
      case HomeView.WatchLater:
        return {
          ...defaultSettings.watchLaterViewSorting,
          ...settings.watchLaterViewSorting,
        };
      case HomeView.All:
      default:
        return {
          ...defaultSettings.allViewSorting,
          ...settings.allViewSorting,
        };
    }
  });

export const selectHomeDisplayOptions = createSelector(
  selectSettings,
  (settings) => ({
    ...defaultSettings.homeDisplayOptions,
    ...settings.homeDisplayOptions,
  }),
);

export const selectHiddenViews = createSelector(
  selectHomeDisplayOptions,
  (options) => options.hiddenViews,
);

export const selectExtraVideoActions = createSelector(
  selectHomeDisplayOptions,
  (options) => options.extraVideoActions,
);

export const selectHasExtraVideoAction = (action: ExtraVideoAction) =>
  createSelector(selectHomeDisplayOptions, (options) =>
    options.extraVideoActions.includes(action),
  );

export const selectRecentVideosSeniority = createSelector(
  selectSettings,
  (settings) => settings.recentVideosSeniority,
);
