import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeView, Settings } from 'models';

export const defaultSettings = {
  defaultView: HomeView.All,
  apiKey: '',
  darkMode: false,
};

interface settingsState extends Settings {}

const initialState: settingsState = {
  ...defaultSettings,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Settings>) => {
      state = action.payload;
    },
    resetSettings: (state) => {
      state = defaultSettings;
    },
  },
});

export const { setSettings, resetSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
