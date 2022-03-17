import { youtubeApi } from './api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { niceDuration, shortenLargeNumber, TimeAgo } from 'helpers/utils';
import { Channel, ChannelActivities, Response, Video, VideoFlags } from 'types';
import { saveVideos } from 'store/reducers/videos';
import { parseVideoField, evaluateField } from './utils';

type FindChannelByNameArgs = {
  name: string;
  maxResults?: number;
};

type FindChannelByNameResponse = {
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
  total: number;
};

type GetVideosByIdArgs = {
  ids: string[];
  maxResults?: number;
};

type GetVideosByIdResponse = {
  items: Video[];
  total: number;
};

type GetChannelVideosArgs = GetChannelActivitiesArgs & {
  persistVideos?: boolean;
  persistVideosFlags?: VideoFlags;
};

export type GetChannelVideosResponse = GetVideosByIdResponse;

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
    transformResponse: (response: Response): GetChannelActivitiesResponse => ({
      items: response.items
        .filter((item) => item.snippet.type === 'upload')
        .map((item) => ({
          videoId: item.contentDetails.upload.videoId,
        })),
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

const extendedApi = youtubeApi.injectEndpoints({
  endpoints: (builder) => ({
    findChannelByName: builder.query<
      FindChannelByNameResponse,
      FindChannelByNameArgs
    >(queries.findChannelByName),
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
          })
        );
        if (!result.data) {
          return { error: result.error as FetchBaseQueryError };
        }
        return {
          data: queries.getVideosById.transformResponse(
            result.data as Response
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
          })
        );
        if (activities.error) {
          return { error: activities.error as FetchBaseQueryError };
        }
        const { items, total } = queries.getChannelActivities.transformResponse(
          activities.data as Response
        );
        // Fetch channel videos
        const ids = items.map(({ videoId }) => videoId);
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
          })
        );
        if (!result.data) {
          return { error: result.error as FetchBaseQueryError };
        }
        const videosData = queries.getVideosById.transformResponse(
          result.data as Response
        );
        if (channel.filters && channel.filters.length > 0) {
          videosData.items = videosData.items.filter((video) =>
            channel.filters!.some((filter) => {
              const videoField = parseVideoField(video, filter.field);
              return evaluateField(videoField, filter.operator, filter.value);
            })
          );
        }
        return {
          data: {
            ...videosData,
            total,
          },
        };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { persistVideos, persistVideosFlags: flags = {} } = arg;
        try {
          if (persistVideos) {
            const { data } = await queryFulfilled;
            dispatch(
              saveVideos({
                videos: data.items,
                flags,
              })
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
  useGetChannelActivitiesQuery,
  useGetVideosByIdQuery,
  useGetChannelVideosQuery,
} = extendedApi;
