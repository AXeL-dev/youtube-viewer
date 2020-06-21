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
  autoClearRecentVideos: boolean,
  autoClearCache: boolean,
}
