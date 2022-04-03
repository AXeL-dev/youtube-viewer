import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeView, Settings, VideosSeniority, ViewFilters } from 'types';

const { REACT_APP_YOUTUBE_API_KEY } = process.env;

export const defaultSettings = {
  defaultView: HomeView.All,
  apiKey: REACT_APP_YOUTUBE_API_KEY || '',
  darkMode: false,
  autoPlayVideos: true,
  recentVideosSeniority: VideosSeniority.OneDay,
  recentViewFilters: {
    uncategorised: true,
    viewed: true,
    watchLater: true,
  },
  watchLaterViewFilters: {
    uncategorised: true,
    viewed: true,
    archived: true,
  },
  enableNotifications: true,
};

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
      }>
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
  },
});

export const { setSettings, resetSettings, setViewFilters } =
  settingsSlice.actions;

export default settingsSlice.reducer;
