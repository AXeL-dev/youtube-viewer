import {
  FilterVideosOptions,
  GetVideosByIdResponse,
  PersistVideosOptions,
  useGetChannelActivitiesQuery,
  useGetVideosByIdQuery,
} from 'store/services/youtube';
import {
  evaluateField,
  filterVideoByFlags,
  parseVideoField,
  recalculateTotalAndCount,
} from './utils';
import { Channel } from 'types';

interface IResult extends GetVideosByIdResponse {}

interface IUseGetChannelVideosProps {
  channel: Channel;
  publishedAfter?: string;
  maxResults?: number;
  limit?: number;
  skip: boolean;
  // pollingInterval?: number;
  persistVideosOptions?: PersistVideosOptions;
  filterVideosOptions?: FilterVideosOptions;
  lastVideoId?: string;
  selectFromResult?: (result: IResult) => IResult;
}

const defaultSelectFromResult = (result: IResult) => result;

export function useGetChannelVideos({
  channel,
  publishedAfter,
  maxResults,
  limit,
  skip,
  // pollingInterval,
  persistVideosOptions,
  filterVideosOptions,
  lastVideoId,
  selectFromResult = defaultSelectFromResult,
}: IUseGetChannelVideosProps) {
  const activitiesMaxResults =
    limit && maxResults ? limit + maxResults : maxResults;
  const activities = useGetChannelActivitiesQuery(
    {
      channel,
      publishedAfter,
      maxResults: activitiesMaxResults,
    },
    {
      skip,
      // pollingInterval,
      selectFromResult: (result) => {
        const { data } = result;
        let { count = 0, total = 0 } = data || {};
        let ids: string[] = [];

        if (data) {
          // Fix: wrong total count (ex: maxResults = 6, total = 2, count = 1)
          if (
            activitiesMaxResults &&
            activitiesMaxResults >= total &&
            count < total
          ) {
            total = count;
          }
          // Get videos ids
          ids = data.items.map(({ videoId }) => videoId);
          let startIndex = 0;
          if (filterVideosOptions) {
            // Apply filters
            const { videosById, filters } = filterVideosOptions;
            ids = ids.filter((id) => {
              if (videosById[id]) {
                return filterVideoByFlags(videosById[id], filters);
              }
              return filters.others;
            });
            // Recalculate total & count
            [total, count] = recalculateTotalAndCount(
              ids.length,
              count,
              total,
              maxResults,
            );
          }
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
        }

        return {
          ...result,
          data: {
            ...data,
            count,
            total,
          },
          ids,
        };
      },
    },
  );

  const { data, error, isLoading, isFetching, ...rest } = useGetVideosByIdQuery(
    {
      ids: activities.ids,
      maxResults,
      persistVideosOptions,
    },
    {
      skip: skip || !activities.data,
      // pollingInterval,
      selectFromResult: (result) => {
        let { data } = result;
        let count = data?.items.length || 0;
        let total = activities.data?.total || 0;

        if (data) {
          // Fix: force filter by publish date (since we may receive wrong activities data from the youtube API sometimes)
          if (publishedAfter) {
            data.items = data.items.filter(
              (video) =>
                video.publishedAt >= new Date(publishedAfter).getTime(),
            );
            // Recalculate total & count
            [total, count] = recalculateTotalAndCount(
              data.items.length,
              count,
              total,
              maxResults,
            );
          }
          // Apply custom channel filters
          if (channel.filters && channel.filters.length > 0) {
            data.items = data.items.filter((video) =>
              channel.filters!.some((filter) => {
                const videoField = parseVideoField(video, filter.field);
                return evaluateField(videoField, filter.operator, filter.value);
              }),
            );
            // Recalculate total & count
            [total, count] = recalculateTotalAndCount(
              data.items.length,
              count,
              total,
              maxResults,
            );
          }
          // Update data
          data = selectFromResult({
            ...data,
            count,
            total,
          });
        }

        return {
          ...result,
          data,
        };
      },
    },
  );

  return {
    data,
    error: activities.error || error,
    isLoading: activities.isLoading || isLoading,
    isFetching: activities.isFetching || isFetching,
    ...rest,
  };
}
