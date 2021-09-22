import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeView, Settings } from 'types';

export const defaultSettings = {
  defaultView: HomeView.All,
  apiKey: '',
  darkMode: false,
  autoPlayVideos: true,
};

interface SettingsState extends Settings {}

const initialState: SettingsState = {
  ...defaultSettings,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetSettings: (state) => {
      return defaultSettings;
    },
  },
});

export const { setSettings, resetSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
