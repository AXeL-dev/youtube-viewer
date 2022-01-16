export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  publishedAt: number;
  publishedSince: string;
  thumbnail: string;
  views: string | number;
  channelId: string;
  channelTitle: string;
}

export type VideoFlags = Partial<{
  viewed: boolean;
  toWatchLater: boolean;
  notified: boolean;
  recent: boolean;
}>;

export type VideoFlag = keyof VideoFlags;

export interface VideoCache {
  id: string;
  channelId: string;
  publishedAt: number;
  flags: VideoFlags;
}

export type LegacyVideoCache = VideoCache &
  Partial<{
    isViewed: boolean;
    isToWatchLater: boolean;
    isNotified: boolean;
  }>;
