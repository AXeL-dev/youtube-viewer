import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';
import { Response } from 'types';
import {
  queries,
  FindChannelByNameArgs,
  GetChannelActivitiesArgs,
  GetVideosByIdArgs,
  GetChannelVideosArgs,
  FindChannelByNameResponse,
  GetChannelActivitiesResponse,
  GetVideosByIdResponse,
  GetChannelVideosResponse,
} from './queries';

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
    findChannelByName: builder.query<
      FindChannelByNameResponse,
      FindChannelByNameArgs
    >(queries.findChannelByName),
    getChannelActivities: builder.query<
      GetChannelActivitiesResponse,
      GetChannelActivitiesArgs
    >(queries.getChannelActivities),
    getVideosById: builder.query<GetVideosByIdResponse, GetVideosByIdArgs>(
      queries.getVideosById
    ),
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
        const result = await fetchWithBQ(
          queries.getVideosById.query({
            ids,
            maxResults,
          })
        );
        return result.data
          ? {
              data: {
                ...queries.getVideosById.transformResponse(
                  result.data as Response
                ),
                total,
              },
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
