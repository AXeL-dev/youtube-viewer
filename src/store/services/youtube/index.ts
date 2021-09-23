import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';
import { Channel, ChannelActivities, Response, Video } from 'types';
import {
  queries,
  FindChannelByNameArgs,
  GetChannelActivitiesArgs,
  GetVideosByIdArgs,
  GetChannelVideosArgs,
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
    findChannelByName: builder.query<Channel[], FindChannelByNameArgs>(
      queries.findChannelByName
    ),
    getChannelActivities: builder.query<
      ChannelActivities[],
      GetChannelActivitiesArgs
    >(queries.getChannelActivities),
    getVideosById: builder.query<Video[], GetVideosByIdArgs>(
      queries.getVideosById
    ),
    getChannelVideos: builder.query<Video[], GetChannelVideosArgs>({
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
        const ids = queries.getChannelActivities
          .transformResponse(activities.data as Response)
          .map(({ videoId }) => videoId);
        // Fetch channel videos
        const result = await fetchWithBQ(
          queries.getVideosById.query({
            ids,
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
