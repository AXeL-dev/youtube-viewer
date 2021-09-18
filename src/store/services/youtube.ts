import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';
import { Channel, Response } from 'types';

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
    findChannelByName: builder.query<Channel[], { name: string; maxResults?: number }>({
      query: ({ name: q, maxResults = 10 }) => ({
        url: 'search',
        params: {
          part: 'snippet',
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
        return response.items.map((channel) => ({
          title: channel.snippet.title,
          url: `https://www.youtube.com/channel/${channel.snippet.channelId}/videos`,
          description: channel.snippet.description,
          thumbnail: channel.snippet.thumbnails.medium.url,
          id: channel.snippet.channelId,
        }));
      },
    }),
  }),
});

export const { useFindChannelByNameQuery } = youtubeApi;
