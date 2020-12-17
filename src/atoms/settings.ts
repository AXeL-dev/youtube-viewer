import { atom } from 'jotai';
import { ChannelSelection } from '../models/Channel';
import { Settings } from '../models/Settings';

export const settingsAtom = atom({
  defaultChannelSelection: ChannelSelection.All,
  videosPerChannel: 9,
  videosAnteriority: 30, // days
  sortVideosBy: 'date',
  autoVideosCheckRate: 30, // minutes
  enableRecentVideosNotifications: true,
  autoPlayVideos: false,
  openVideosInInactiveTabs: false,
  openChannelsOnNameClick: false,
  hideEmptyChannels: true,
  autoClearRecentVideos: true,
  autoClearCache: false
} as Settings);
