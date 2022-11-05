import { youtubeApi } from './api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { niceDuration, shortenLargeNumber, TimeAgo } from 'helpers/utils';
import { Channel, ChannelActivities, Response, Video, VideoFlags } from 'types';
import { saveVideos } from 'store/reducers/videos';
import { parseVideoField, evaluateField, isFetchTimeoutError } from './utils';

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
};

export interface PersistVideosOptions {
  enable: boolean;
  flags?: VideoFlags;
}

export type GetChannelVideosResponse = GetVideosByIdResponse & {
  count: number;
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
    getVideosById: builder.query<GetVideosByIdResponse, GetVideosByIdArgs>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
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
          data: queries.getVideosById.transformResponse(
            result.data as Response,
          ),
        };
      },
    }),
    getChannelVideos: builder.query<
      GetChannelVideosResponse,
      GetChannelVideosArgs
    >({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const { channel, publishedAfter, maxResults } = _arg;
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
        let count = activitiesData.items.length;
        let total = activitiesData.total;
        // Fix: wrong total count (ex: maxResults = 6, total = 2, count = 1)
        if (maxResults && maxResults >= total && count < total) {
          total = count;
        }
        // Fetch channel videos
        const ids = activitiesData.items.map(({ videoId }) => videoId);
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
        // Fix: force filter by publish date (since we may receive wrong activities data from the youtube API sometimes)
        if (publishedAfter) {
          videosData.items = videosData.items.filter(
            (video) => video.publishedAt >= new Date(publishedAfter).getTime(),
          );
          const newCount = videosData.items.length;
          if (newCount < count && maxResults && newCount < maxResults) {
            total = newCount;
          } else {
            total = total - (count - newCount);
          }
          count = newCount;
        }
        // Apply custom user filters
        if (channel.filters && channel.filters.length > 0) {
          videosData.items = videosData.items.filter((video) =>
            channel.filters!.some((filter) => {
              const videoField = parseVideoField(video, filter.field);
              return evaluateField(videoField, filter.operator, filter.value);
            }),
          );
          // Recalculate total & count
          const newCount = videosData.items.length;
          total = total - (count - newCount);
          count = newCount;
        }
        return {
          data: {
            ...videosData,
            count,
            total,
          },
        };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
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
    }),
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
