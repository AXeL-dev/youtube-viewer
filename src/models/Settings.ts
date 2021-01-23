import { ChannelSelection } from "./Channel";
import { SortCriteria } from "./Sort";

export interface Settings {
  defaultChannelSelection: ChannelSelection,
  videosPerChannel: number,
  videosAnteriority: number,
  sortVideosBy: SortCriteria,
  apiKey?: string,
  autoVideosCheckRate: number,
  enableRecentVideosNotifications: boolean,
  autoPlayVideos: boolean,
  openVideosInInactiveTabs: boolean,
  openChannelsOnNameClick: boolean,
  hideEmptyChannels: boolean,
  autoCloseDrawer: boolean,
  autoClearRecentVideos: boolean,
  autoRemoveWatchLaterVideos: boolean,
  autoClearCache: boolean,
}

export enum SettingsType {
  String,
  Number,
  Boolean
}
