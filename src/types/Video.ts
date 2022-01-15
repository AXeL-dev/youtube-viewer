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

export interface VideoFlags {
  viewed: boolean;
  toWatchLater: boolean;
  checked: boolean;
}

export interface VideoCache {
  id: string;
  channelId: string;
  publishedAt: number;
  flags: Partial<VideoFlags>;
}

export type LegacyVideoCache = VideoCache &
  Partial<{
    isViewed: boolean;
    isToWatchLater: boolean;
    isNotified: boolean;
  }>;
