import { ChannelSelection } from "./Channel";

export interface Settings {
  defaultChannelSelection: ChannelSelection,
  videosPerChannel: number,
  videosAnteriority: number,
  sortVideosBy: string,
  apiKey?: string,
  autoVideosCheckRate: number,
  enableRecentVideosNotifications: boolean,
  autoPlayVideos: boolean,
  openVideosInInactiveTabs: boolean,
  openChannelsOnNameClick: boolean,
  hideEmptyChannels: boolean,
  autoCloseDrawer: boolean,
  autoClearRecentVideos: boolean,
  autoClearCache: boolean,
}

export enum SettingsType {
  String,
  Number,
  Boolean
}
