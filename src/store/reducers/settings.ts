import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChannelSelection, Settings, SortCriteria } from 'models';

export const defaultSettings = {
  defaultChannelSelection: ChannelSelection.All,
  videosPerChannel: 9,
  videosAnteriority: 30, // days
  sortVideosBy: SortCriteria.Date,
  autoVideosCheckRate: 30, // minutes
  enableRecentVideosNotifications: true,
  autoPlayVideos: false,
  openVideosInInactiveTabs: false,
  openChannelsOnNameClick: false,
  hideEmptyChannels: true,
  autoCloseDrawer: false,
  autoClearRecentVideos: true,
  autoRemoveWatchLaterVideos: true,
  autoClearCache: false,
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
  },
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
