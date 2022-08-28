import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  HomeDisplayOptions,
  HomeView,
  Settings,
  VideosSeniority,
  ViewFilters,
} from 'types';

const { REACT_APP_YOUTUBE_API_KEY } = process.env;

export const defaultSettings = {
  defaultView: HomeView.All,
  apiKey: REACT_APP_YOUTUBE_API_KEY || '',
  darkMode: false,
  autoPlayVideos: true,
  recentVideosSeniority: VideosSeniority.OneDay,
  recentViewFilters: {
    viewed: true,
    watchLater: true,
    ignored: false,
    others: true,
  },
  watchLaterViewFilters: {
    viewed: true,
    archived: true,
    others: true,
  },
  homeDisplayOptions: {
    hiddenViews: [],
  },
  enableNotifications: true,
  queryTimeout: 10000,
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
      switch (view) {
        case HomeView.Recent:
          return {
            ...state,
            recentViewFilters: {
              ...state.recentViewFilters,
              ...filters,
            },
          };
        case HomeView.WatchLater:
          return {
            ...state,
            watchLaterViewFilters: {
              ...state.watchLaterViewFilters,
              ...filters,
            },
          };
        default:
          return state;
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
  setHomeDisplayOptions,
} = settingsSlice.actions;

export default settingsSlice.reducer;
