
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
  isToWatchLater?: boolean
}
