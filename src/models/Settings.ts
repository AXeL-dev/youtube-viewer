import { ChannelSelection } from "./Channel";

export interface Settings {
  defaultChannelSelection: ChannelSelection,
  videosPerChannel: number,
  videosAnteriority: number,
  sortVideosBy: string,
  apiKey?: string,
  autoVideosCheckRate: number,
  autoPlayVideos: boolean,
  openVideosInInactiveTabs: boolean,
  openChannelsOnNameClick: boolean,
  autoClearCache: boolean,
}
