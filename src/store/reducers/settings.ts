import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  HomeView,
  Settings,
  VideosDisplayOptions,
  VideosSeniority,
} from 'types';

const { REACT_APP_YOUTUBE_API_KEY } = process.env;

export const defaultSettings = {
  defaultView: HomeView.All,
  apiKey: REACT_APP_YOUTUBE_API_KEY || '',
  darkMode: false,
  autoPlayVideos: true,
  recentVideosSeniority: VideosSeniority.OneDay,
  recentVideosDisplayOptions: {
    hideViewedVideos: false,
    hideWatchLaterVideos: false,
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
    setRecentVideosDisplayOptions: (
      state,
      action: PayloadAction<Partial<VideosDisplayOptions>>
    ) => {
      return {
        ...state,
        recentVideosDisplayOptions: {
          ...state.recentVideosDisplayOptions,
          ...action.payload,
        },
      };
    },
  },
});

export const { setSettings, resetSettings, setRecentVideosDisplayOptions } =
  settingsSlice.actions;

export default settingsSlice.reducer;
