import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';
import { Channel, ChannelActivities, Response, Video } from 'types';
import {
  elapsedHours,
  niceDuration,
  shortenLargeNumber,
  TimeAgo,
} from 'helpers/utils';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://www.googleapis.com/youtube/v3/',
  prepareHeaders: (headers, { getState }) => {
    const apiKey = (getState() as RootState).settings.apiKey;
    if (apiKey) {
      headers.set('X-Goog-Api-Key', apiKey);
    }
    return headers;
  },
});

export const youtubeApi = createApi({
  reducerPath: 'youtubeApi',
  baseQuery,
  endpoints: (builder) => ({
    // Channel search query
    findChannelByName: builder.query<
      Channel[],
      { name: string; maxResults?: number }
    >({
      query: ({ name: q, maxResults = 10 }) => ({
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
      transformResponse: (response: Response) => {
        if (response.pageInfo.totalResults === 0) {
          return [];
        }
        return response.items.map((item) => ({
          title: item.snippet.title,
          url: `https://www.youtube.com/channel/${item.snippet.channelId}/videos`,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          id: item.snippet.channelId,
        }));
      },
    }),
    // Channel activities query
    getChannelActivities: builder.query<
      ChannelActivities[],
      { channel: Channel; publishedAfter: string; maxResults?: number }
    >({
      query: ({ channel, publishedAfter, maxResults = 10 }) => ({
        url: 'activities',
        params: {
          part: 'contentDetails',
          fields: 'pageInfo,items(contentDetails)',
          channelId: channel.id,
          publishedAfter,
          maxResults,
        },
      }),
      transformResponse: (response: Response) => {
        if (response.pageInfo.totalResults === 0) {
          return [];
        }
        return response.items
          .map((item) => ({
            videoId: item.contentDetails.upload?.videoId,
          }))
          .filter(({ videoId }) => videoId);
      },
    }),
    // Videos informations query
    getVideosById: builder.query<
      Video[],
      { id: string | string[]; maxResults?: number }
    >({
      query: ({ id, maxResults = 10 }) => ({
        url: 'videos',
        params: {
          part: 'snippet,contentDetails,statistics,id',
          fields:
            'pageInfo,items(id,contentDetails/duration,statistics/viewCount,snippet(title,channelTitle,channelId,publishedAt,thumbnails/medium))',
          id: id instanceof Array ? id.join(',') : id,
          maxResults,
        },
      }),
      transformResponse: (response: Response) => {
        if (response.pageInfo.totalResults === 0) {
          return [];
        }
        return response.items.map((item) => {
          const publishDate = new Date(item.snippet.publishedAt);
          const publishedAt = publishDate.getTime();
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
            isRecent: elapsedHours(publishDate) <= 24,
          };
        });
      },
    }),
  }),
});

export const {
  useFindChannelByNameQuery,
  useGetChannelActivitiesQuery,
  useGetVideosByIdQuery,
} = youtubeApi;
