
export interface Channel {
  id: string,
  thumbnail: string,
  title: string,
  url: string,
  description: string,
  isHidden: boolean,
  notifications: ChannelNotifications
}

export interface ChannelNotifications {
  isDisabled: boolean
}

export enum ChannelSelection {
  None = -1,
  All = -2,
  RecentVideos = -3,
  TodaysVideos = -4,
  WatchLaterVideos = -5
}
