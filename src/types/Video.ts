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
  isRecent?: boolean;
}
