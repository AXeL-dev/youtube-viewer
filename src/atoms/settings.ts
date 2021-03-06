import { atom } from 'jotai';
import { ChannelSelection, Settings, SortCriteria } from 'models';

export const defaultSettings: Settings = {
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
  autoClearCache: false
};

export const settingsAtom = atom(defaultSettings);
