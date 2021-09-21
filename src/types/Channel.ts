export interface Channel {
  id: string;
  thumbnail: string;
  title: string;
  url: string;
  description: string;
  isHidden?: boolean;
  notifications?: ChannelNotifications;
}

export interface ChannelNotifications {
  isDisabled: boolean;
}

export interface ChannelActivities {
  videoId: string;
}
