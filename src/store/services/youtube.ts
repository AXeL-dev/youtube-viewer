import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';
import { Channel, ChannelActivities, Response, Video } from 'types';
import { niceDuration, shortenLargeNumber, TimeAgo } from 'helpers/utils';

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

interface FindChannelByNameArgs {
  name: string;
  maxResults?: number;
}

interface GetChannelActivitiesArgs {
  channel: Channel;
  publishedAfter: string;
  maxResults?: number;
}

interface GetVideosByIdArgs {
  id: string | string[];
  maxResults?: number;
}

const queries = {
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
  },
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
  },
  getVideosById: {
    query: ({ id, maxResults = 10 }: GetVideosByIdArgs) => ({
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
      });
    },
  },
};

export const youtubeApi = createApi({
  reducerPath: 'youtubeApi',
  baseQuery,
  endpoints: (builder) => ({
    // Channel search query
    findChannelByName: builder.query<Channel[], FindChannelByNameArgs>(
      queries.findChannelByName
    ),
    // Channel activities query
    getChannelActivities: builder.query<
      ChannelActivities[],
      GetChannelActivitiesArgs
    >(queries.getChannelActivities),
    // Videos informations query
    getVideosById: builder.query<Video[], GetVideosByIdArgs>(
      queries.getVideosById
    ),
    // Channel videos query
    getChannelVideos: builder.query<Video[], GetChannelActivitiesArgs>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const { channel, publishedAfter, maxResults } = _arg;
        // Fetch channel activities
        const activities = await fetchWithBQ(
          queries.getChannelActivities.query({
            channel,
            publishedAfter,
            maxResults,
          })
        );
        if (activities.error) {
          return { error: activities.error as FetchBaseQueryError };
        }
        const id = queries.getChannelActivities
          .transformResponse(activities.data as Response)
          .map(({ videoId }) => videoId);
        // Fetch channel videos
        const result = await fetchWithBQ(
          queries.getVideosById.query({
            id,
            maxResults,
          })
        );
        return result.data
          ? {
              data: queries.getVideosById.transformResponse(
                result.data as Response
              ),
            }
          : { error: result.error as FetchBaseQueryError };
      },
    }),
  }),
});

export const {
  useFindChannelByNameQuery,
  useGetChannelActivitiesQuery,
  useGetVideosByIdQuery,
  useGetChannelVideosQuery,
} = youtubeApi;
