import { SortOrder } from "./Sort";

export interface Video {
  id: string,
  title: string,
  url: string,
  duration: string,
  publishedAt: number,
  thumbnail: string,
  views: {
    count: number,
    asString: string,
  },
  channelId: string,
  channelTitle: string,
  isRecent?: boolean,
  isToWatchLater?: boolean,
  isWatched?: boolean
}

export interface VideosCache {
  [key: string]: Video[] // key == channel id
}

export interface VideosSortOrder {
  [key: number]: SortOrder // key == Channel index || ChannelSelection
}
