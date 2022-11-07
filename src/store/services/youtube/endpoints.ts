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
import { Channel, ChannelActivities, Response, Video, VideoFlags } from 'types';
import { parseVideoField, evaluateField, isFetchTimeoutError } from './utils';
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
};

type GetVideosByIdResponse = {
  items: Video[];
  total: number;
};

type GetChannelVideosArgs = GetChannelActivitiesArgs & {
  persistVideosOptions?: PersistVideosOptions;
  lastVideoId?: string;
};

export interface PersistVideosOptions {
  enable: boolean;
  flags?: VideoFlags;
}

export type GetChannelVideosResponse = GetVideosByIdResponse & {
  count: number;
};

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

const recalculateTotalAndCount = (
  items: any[],
  oldCount: number,
  oldTotal: number,
  maxResults: number | undefined,
) => {
  let total = oldTotal;
  const count = items.length;
  if (count < oldCount && maxResults && count < maxResults) {
    total = count;
  } else {
    total = oldTotal - (oldCount - count);
  }
  return [total, count];
};

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
      total: response.pageInfo.totalResults,
    }),
  },
};

const extendedQueries = {
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
  },
  // Channel videos query
  getChannelVideos: {
    queryFn: async (
      _arg: GetChannelVideosArgs,
      _api: BaseQueryApi,
      _extraOptions: BaseQueryExtraOptions,
      fetchWithBQ: FetchWithBQ,
    ) => {
      const { channel, publishedAfter, maxResults, lastVideoId } = _arg;
      // Fetch channel activities
      const activities = await fetchWithBQ(
        queries.getChannelActivities.query({
          channel,
          publishedAfter,
          maxResults,
        }),
      );
      if (activities.error) {
        if (isFetchTimeoutError(activities.error)) {
          console.error(activities.error);
          return {
            data: {
              items: [],
              count: 0,
              total: 0,
            },
          };
        }
        return { error: activities.error as FetchBaseQueryError };
      }
      const activitiesData = queries.getChannelActivities.transformResponse(
        activities.data as Response,
      );
      let { count, total } = activitiesData;
      // Fix: wrong total count (ex: maxResults = 6, total = 2, count = 1)
      if (maxResults && maxResults >= total && count < total) {
        total = count;
      }
      // Fetch channel videos
      let ids = activitiesData.items.map(({ videoId }) => videoId);
      let startIndex = 0;
      if (lastVideoId) {
        const index = ids.findIndex((id) => id === lastVideoId);
        if (index >= 0) {
          startIndex = index + 1; // start from the next item
        }
      }
      // Restrict max ids number to 50
      // @see https://developers.google.com/youtube/v3/docs/videos/list#request
      let endIndex = startIndex + 50;
      if (maxResults) {
        endIndex = Math.min(endIndex, startIndex + maxResults);
      }
      ids = ids.slice(startIndex, endIndex);
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
        return { error: result.error as FetchBaseQueryError };
      }
      const videosData = queries.getVideosById.transformResponse(
        result.data as Response,
      );
      count = videosData.items.length;
      // Fix: force filter by publish date (since we may receive wrong activities data from the youtube API sometimes)
      if (publishedAfter) {
        videosData.items = videosData.items.filter(
          (video) => video.publishedAt >= new Date(publishedAfter).getTime(),
        );
        // Recalculate total & count
        [total, count] = recalculateTotalAndCount(
          videosData.items,
          total,
          count,
          maxResults,
        );
      }
      // Apply custom channel filters
      if (channel.filters && channel.filters.length > 0) {
        videosData.items = videosData.items.filter((video) =>
          channel.filters!.some((filter) => {
            const videoField = parseVideoField(video, filter.field);
            return evaluateField(videoField, filter.operator, filter.value);
          }),
        );
        // Recalculate total & count
        [total, count] = recalculateTotalAndCount(
          videosData.items,
          total,
          count,
          maxResults,
        );
      }
      return {
        data: {
          ...videosData,
          count,
          total,
        },
      };
    },
    onQueryStarted: async (
      arg: GetChannelVideosArgs,
      {
        dispatch,
        queryFulfilled,
      }: QueryLifecycleApi<GetChannelVideosArgs, GetChannelVideosResponse>,
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
    >(queries.getChannelActivities),
    getVideosById: builder.query<GetVideosByIdResponse, GetVideosByIdArgs>(
      extendedQueries.getVideosById,
    ),
    getChannelVideos: builder.query<
      GetChannelVideosResponse,
      GetChannelVideosArgs
    >(extendedQueries.getChannelVideos),
  }),
  overrideExisting: false,
});

export const {
  useFindChannelByNameQuery,
  useFindChannelByIdQuery,
  useGetChannelActivitiesQuery,
  useGetVideosByIdQuery,
  useGetChannelVideosQuery,
} = extendedApi;
