import { BaseQueryExtraOptions, youtubeApi } from './api';
import {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query';
import {
  BaseQueryFn,
  QueryReturnValue,
} from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { QueryLifecycleApi as BaseQueryLifecycleApi } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { niceDuration, shortenLargeNumber, TimeAgo } from 'helpers/utils';
import {
  Channel,
  ChannelActivities,
  Response,
  Video,
  VideoCache,
  VideoFlags,
  ViewFilters,
} from 'types';
import { isFetchTimeoutError } from './utils';
import { saveVideos } from 'store/reducers/videos';

type FindChannelByNameArgs = {
  name: string;
  maxResults?: number;
};

type FindChannelByNameResponse = {
  items: Channel[];
  total: number;
};

type FindChannelByIdArgs = {
  id: string;
  maxResults?: number;
};

type FindChannelByIdResponse = {
  items: Channel[];
  total: number;
};

type GetChannelActivitiesArgs = {
  channel: Channel;
  publishedAfter?: string;
  publishedBefore?: string;
  maxResults?: number;
};

type GetChannelActivitiesResponse = {
  items: ChannelActivities[];
  count: number;
  total: number;
};

export type GetVideosByIdArgs = {
  ids: string[];
  maxResults?: number;
  persistVideosOptions?: PersistVideosOptions;
};

export type GetVideosByIdResponse = {
  items: Video[];
  count: number;
  total: number;
};

export interface PersistVideosOptions {
  enable: boolean;
  flags?: VideoFlags;
}

export interface FilterVideosOptions {
  videosById: { [key: string]: VideoCache };
  filters: ViewFilters;
}

type FetchWithBQ = (
  arg: string | FetchArgs,
) => Promise<
  QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
>;

type QueryLifecycleApi<QueryArg, ResultType> = BaseQueryLifecycleApi<
  QueryArg,
  BaseQueryFn<QueryArg, unknown, unknown, BaseQueryExtraOptions>,
  ResultType,
  'youtubeApi'
>;

const queries = {
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
  // Channel find by id query
  findChannelById: {
    query: ({ id, maxResults = 10 }: FindChannelByIdArgs) => ({
      url: 'channels',
      params: {
        part: 'snippet,id',
        fields: 'pageInfo,items(snippet,id)',
        maxResults,
        id,
      },
    }),
    transformResponse: (response: Response): FindChannelByIdResponse => ({
      items: response.items.map((item) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/channel/${item.id}/videos`,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        id: item.id,
      })),
      total: response.pageInfo.totalResults,
    }),
  },
  // Channel activities query
  getChannelActivities: {
    query: ({
      channel,
      publishedAfter,
      publishedBefore,
      maxResults = 10,
    }: GetChannelActivitiesArgs) => ({
      url: 'activities',
      params: {
        part: 'snippet,contentDetails',
        fields: 'pageInfo,items(snippet(type),contentDetails)',
        channelId: channel.id,
        ...(publishedAfter ? { publishedAfter } : {}),
        ...(publishedBefore ? { publishedBefore } : {}),
        maxResults,
      },
    }),
    transformResponse: (response: Response): GetChannelActivitiesResponse => {
      const items = response.items
        .filter((item) => item.snippet.type === 'upload')
        .map((item) => ({
          videoId: item.contentDetails.upload.videoId,
        }));
      const count = items.length;
      const total =
        response.pageInfo.totalResults - (response.items.length - count);
      return {
        items,
        count,
        total,
      };
    },
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
      count: response.items.length,
      total: response.pageInfo.totalResults,
    }),
  },
};

const extendedQueries = {
  // Channel activities query
  getChannelActivities: {
    queryFn: async (
      _arg: GetChannelActivitiesArgs,
      _api: BaseQueryApi,
      _extraOptions: BaseQueryExtraOptions,
      fetchWithBQ: FetchWithBQ,
    ) => {
      const result = await fetchWithBQ(
        queries.getChannelActivities.query(_arg),
      );
      if (!result.data) {
        if (isFetchTimeoutError(result.error)) {
          console.error(result.error);
          return {
            data: {
              items: [],
              count: 0,
              total: 0,
            },
          };
        }
        return { error: result.error as FetchBaseQueryError };
      }
      return {
        data: queries.getChannelActivities.transformResponse(
          result.data as Response,
        ),
      };
    },
  },
  // Videos by id query
  getVideosById: {
    queryFn: async (
      _arg: GetVideosByIdArgs,
      _api: BaseQueryApi,
      _extraOptions: BaseQueryExtraOptions,
      fetchWithBQ: FetchWithBQ,
    ) => {
      const { ids, maxResults } = _arg;
      if (ids.length === 0) {
        return {
          data: {
            items: [],
            count: 0,
            total: 0,
          },
        };
      }
      const result = await fetchWithBQ(
        queries.getVideosById.query({
          ids,
          maxResults,
        }),
      );
      if (!result.data) {
        if (isFetchTimeoutError(result.error)) {
          console.error(result.error);
          return {
            data: {
              items: [],
              count: 0,
              total: 0,
            },
          };
        }
        return { error: result.error as FetchBaseQueryError };
      }
      return {
        data: queries.getVideosById.transformResponse(result.data as Response),
      };
    },
    onQueryStarted: async (
      arg: GetVideosByIdArgs,
      {
        dispatch,
        queryFulfilled,
      }: QueryLifecycleApi<GetVideosByIdArgs, GetVideosByIdResponse>,
    ) => {
      const { persistVideosOptions } = arg;
      try {
        if (persistVideosOptions?.enable) {
          const { flags = {} } = persistVideosOptions;
          const { data } = await queryFulfilled;
          dispatch(
            saveVideos({
              videos: data.items,
              flags,
            }),
          );
        }
      } catch (err) {
        // proceed
      }
    },
  },
};

export const extendedApi = youtubeApi.injectEndpoints({
  endpoints: (builder) => ({
    findChannelByName: builder.query<
      FindChannelByNameResponse,
      FindChannelByNameArgs
    >(queries.findChannelByName),
    findChannelById: builder.query<
      FindChannelByIdResponse,
      FindChannelByIdArgs
    >(queries.findChannelById),
    getChannelActivities: builder.query<
      GetChannelActivitiesResponse,
      GetChannelActivitiesArgs
    >(extendedQueries.getChannelActivities),
    getVideosById: builder.query<GetVideosByIdResponse, GetVideosByIdArgs>(
      extendedQueries.getVideosById,
    ),
  }),
  overrideExisting: false,
});

export const {
  useFindChannelByNameQuery,
  useFindChannelByIdQuery,
  useGetChannelActivitiesQuery,
  useGetVideosByIdQuery,
} = extendedApi;
