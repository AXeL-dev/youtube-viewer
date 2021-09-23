import { niceDuration, shortenLargeNumber, TimeAgo } from 'helpers/utils';
import { Channel, ChannelActivities, Response, Video } from 'types';

export type FindChannelByNameArgs = {
  name: string;
  maxResults?: number;
};

export type FindChannelByNameResponse = {
  items: Channel[];
  total: number;
};

export type GetChannelActivitiesArgs = {
  channel: Channel;
  publishedAfter: string;
  maxResults?: number;
};

export type GetChannelActivitiesResponse = {
  items: ChannelActivities[];
  total: number;
};

export type GetVideosByIdArgs = {
  ids: string[];
  maxResults?: number;
};

export type GetVideosByIdResponse = {
  items: Video[];
  total: number;
};

export type GetChannelVideosArgs = GetChannelActivitiesArgs;

export type GetChannelVideosResponse = GetVideosByIdResponse;

export const queries = {
  // Channel search query
  findChannelByName: {
    query: ({ name: q, maxResults = 10 }: FindChannelByNameArgs) => ({
      url: 'search',
      params: {
        part: 'snippet',
        fields: 'pageInfo,items(snippet)',
        type: 'channel',
        order: 'relevance',
        maxResults,
        q,
      },
    }),
    transformResponse: (response: Response): FindChannelByNameResponse => ({
      items: response.items.map((item) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/channel/${item.snippet.channelId}/videos`,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        id: item.snippet.channelId,
      })),
      total: response.pageInfo.totalResults,
    }),
  },
  // Channel activities query
  getChannelActivities: {
    query: ({
      channel,
      publishedAfter,
      maxResults = 10,
    }: GetChannelActivitiesArgs) => ({
      url: 'activities',
      params: {
        part: 'contentDetails',
        fields: 'pageInfo,items(contentDetails)',
        channelId: channel.id,
        publishedAfter,
        maxResults,
      },
    }),
    transformResponse: (response: Response): GetChannelActivitiesResponse => ({
      items: response.items
        .map((item) => ({
          videoId: item.contentDetails.upload?.videoId,
        }))
        .filter(({ videoId }) => videoId),
      total: response.pageInfo.totalResults,
    }),
  },
  // Videos informations query
  getVideosById: {
    query: ({ ids, maxResults = 10 }: GetVideosByIdArgs) => ({
      url: 'videos',
      params: {
        part: 'snippet,contentDetails,statistics,id',
        fields:
          'pageInfo,items(id,contentDetails/duration,statistics/viewCount,snippet(title,channelTitle,channelId,publishedAt,thumbnails/medium))',
        id: ids.slice(0, maxResults).join(','),
        maxResults,
      },
    }),
    transformResponse: (response: Response): GetVideosByIdResponse => ({
      items: response.items.map((item) => {
        const publishedAt = new Date(item.snippet.publishedAt).getTime();
        return {
          id: item.id,
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id}`,
          duration: niceDuration(item.contentDetails.duration),
          views: shortenLargeNumber(item.statistics.viewCount),
          thumbnail: item.snippet.thumbnails.medium.url,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          publishedAt,
          publishedSince: TimeAgo.inWords(publishedAt),
        };
      }),
      total: response.pageInfo.totalResults,
    }),
  },
};
