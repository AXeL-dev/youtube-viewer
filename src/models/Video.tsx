
export interface Video {
  id: string,
  title: string,
  url: string,
  duration: string,
  publishedAt: string,
  thumbnails: {
    medium: {
      url: string,
      width: number,
      height: number,
    }
  },
  views: string,
  channelId: string,
  channelTitle: string,
}
