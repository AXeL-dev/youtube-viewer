export interface Response {
  kind?: string;
  etag?: string;
  nextPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Item[];
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

type SnippetType =
  | 'channelItem'
  | 'comment'
  | 'favorite'
  | 'like'
  | 'playlistItem'
  | 'promotedItem'
  | 'recommendation'
  | 'social'
  | 'subscription'
  | 'upload';

interface Item {
  id: string;
  snippet: {
    type: SnippetType;
    channelId: string;
    channelTitle: string;
    liveBroadcastContent?: string;
    publishedAt: string;
    publishedTime: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
    };
  };
  contentDetails: {
    upload: {
      videoId: string;
    };
    duration: string;
  };
  statistics: {
    viewCount: number;
  };
}
