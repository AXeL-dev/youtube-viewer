import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  HomeDisplayOptions,
  HomeView,
  QueryTimeout,
  Settings,
  VideosSeniority,
  ViewFilters,
  ViewSorting,
} from 'types';

const { REACT_APP_YOUTUBE_API_KEY } = process.env;

export const defaultSettings = {
  defaultView: HomeView.All,
  apiKey: REACT_APP_YOUTUBE_API_KEY || '',
  darkMode: false,
  autoPlayVideos: true,
  enableNotifications: true,
  queryTimeout: QueryTimeout.ThirtySeconds,
  viewOptions: {
    [HomeView.All]: {
      sorting: {
        publishDate: false,
      },
      filters: {
        seen: true,
        watchLater: true,
        bookmarked: true,
        ignored: false,
        others: true,
      },
      videosSeniority: VideosSeniority.Any,
    },
    [HomeView.WatchLater]: {
      sorting: {
        publishDate: false,
      },
      filters: {
        seen: true,
        bookmarked: true,
        archived: true,
        others: true,
      },
      videosSeniority: VideosSeniority.Any,
    },
    [HomeView.Bookmarks]: {
      sorting: {
        publishDate: false,
      },
      filters: {
        seen: true,
        watchLater: true,
        others: true,
      },
      videosSeniority: VideosSeniority.Any,
    },
  },
  homeDisplayOptions: {
    hiddenViews: [],
    extraVideoActions: [],
  },
};

const views = Object.values(HomeView);

interface SettingsState extends Settings {}

const initialState: SettingsState = {
  ...defaultSettings,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetSettings: (state) => {
      return {
        ...state,
        ...defaultSettings,
      };
    },
    setViewFilters: (
      state,
      action: PayloadAction<{
        view: HomeView;
        filters: Partial<ViewFilters>;
      }>,
    ) => {
      const { view, filters } = action.payload;
      if (state.viewOptions[view]) {
        state.viewOptions[view].filters = {
          ...state.viewOptions[view].filters,
          ...filters,
        };
      }
    },
    setViewSorting: (
      state,
      action: PayloadAction<{
        view: HomeView;
        sorting: Partial<ViewSorting>;
      }>,
    ) => {
      const { view, sorting } = action.payload;
      if (state.viewOptions[view]) {
        state.viewOptions[view].sorting = {
          ...state.viewOptions[view].sorting,
          ...sorting,
        };
      }
    },
    setVideosSeniority: (
      state,
      action: PayloadAction<{
        view: HomeView;
        seniority: VideosSeniority;
      }>,
    ) => {
      const { view, seniority } = action.payload;
      if (state.viewOptions[view]) {
        state.viewOptions[view].videosSeniority = seniority;
      }
    },
    setHomeDisplayOptions: (
      state,
      action: PayloadAction<Partial<HomeDisplayOptions>>,
    ) => {
      const { hiddenViews } = action.payload;
      return {
        ...state,
        defaultView:
          !state.defaultView || hiddenViews?.includes(state.defaultView)
            ? views.find((view) => !hiddenViews?.includes(view)) || null
            : state.defaultView,
        homeDisplayOptions: {
          ...state.homeDisplayOptions,
          ...action.payload,
        },
      };
    },
  },
});

export const {
  setSettings,
  resetSettings,
  setViewFilters,
  setViewSorting,
  setVideosSeniority,
  setHomeDisplayOptions,
} = settingsSlice.actions;

export default settingsSlice.reducer;
