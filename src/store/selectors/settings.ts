import type { RootState } from 'store';
import { createSelector } from 'reselect';
import { HomeView, ViewFilters, ExtraVideoAction, ChannelOptions } from 'types';
import { defaultSettings } from 'store/reducers/settings';

export const selectSettings = (state: RootState) => state.settings;

export const selectMode = createSelector(selectSettings, (settings) =>
  settings.darkMode ? 'dark' : 'light',
);

export const selectViewFilters = (view: HomeView) =>
  createSelector(selectSettings, (settings): ViewFilters => {
    return {
      ...defaultSettings.viewOptions[view].filters,
      ...settings.viewOptions[view].filters,
    } as ViewFilters;
  });

export const selectViewChannelOptions = (view: HomeView) =>
  createSelector(selectSettings, (settings): ChannelOptions => {
    return {
      ...defaultSettings.viewOptions[view].channels,
      ...settings.viewOptions[view].channels,
    } as ChannelOptions;
  });

export const selectViewChannelOption = (
  view: HomeView,
  option: keyof ChannelOptions,
) =>
  createSelector(selectViewChannelOptions(view), (options) => options[option]);

const legacyViewFilterKeys = ['uncategorised', 'viewed'];

export const getActiveViewFilters = (filters: ViewFilters) =>
  Object.entries(filters).filter(
    ([key, value]) => !legacyViewFilterKeys.includes(key) && value,
  );

export const selectActiveViewFiltersCount = (view: HomeView) =>
  createSelector(
    selectViewFilters(view),
    (filters) => getActiveViewFilters(filters).length,
  );

export const selectViewSorting = (view: HomeView) =>
  createSelector(selectSettings, (settings) => {
    return {
      ...defaultSettings.viewOptions[view].sorting,
      ...settings.viewOptions[view].sorting,
    };
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

export const selectHasHiddenView = (view: HomeView) =>
  createSelector(selectHiddenViews, (hiddenViews) =>
    hiddenViews.includes(view),
  );

export const selectExtraVideoActions = createSelector(
  selectHomeDisplayOptions,
  (options) => options.extraVideoActions,
);

export const selectHasExtraVideoAction = (action: ExtraVideoAction) =>
  createSelector(selectExtraVideoActions, (extraVideoActions) =>
    extraVideoActions.includes(action),
  );

export const selectVideosSeniority = (view: HomeView) =>
  createSelector(selectSettings, (settings) => {
    if (settings.viewOptions[view].videosSeniority === undefined) {
      return defaultSettings.viewOptions[view].videosSeniority;
    }
    return settings.viewOptions[view].videosSeniority;
  });
