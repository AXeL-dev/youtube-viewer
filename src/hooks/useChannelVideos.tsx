import { useMemo } from 'react';
import {
  useGetChannelActivitiesQuery,
  useGetVideosByIdQuery,
} from 'store/services/youtube';
import { Channel } from 'types';

interface Props {
  channel: Channel;
  publishedAfter: string;
  maxResults: number;
}

export function useChannelVideos({
  channel,
  publishedAfter,
  maxResults,
}: Props) {
  const {
    data: activities,
    error: activitiesError,
    isLoading: isActivitiesLoading,
  } = useGetChannelActivitiesQuery(
    {
      channel,
      publishedAfter,
      maxResults,
    },
    { skip: !channel }
  );

  const id = useMemo(
    () => activities?.map(({ videoId }) => videoId) || [],
    [activities]
  );

  const { data, error, isLoading } = useGetVideosByIdQuery(
    { id, maxResults },
    { skip: id.length === 0 }
  );

  return {
    data: data || [],
    error: activitiesError || error,
    isLoading: isActivitiesLoading || isLoading,
  };
}
