import { useMemo } from 'react';
import { useGetVideosByIdQuery } from 'store/services/youtube';
import { Channel, HomeView } from 'types';
import { useChannelActivities } from './useChannelActivities';

interface Props {
  channel: Channel;
  view: HomeView;
  publishedAfter: string;
  maxResults: number;
}

export function useChannelVideos({
  channel,
  view,
  publishedAfter,
  maxResults,
}: Props) {
  const {
    data: activities,
    error: activitiesError,
    isLoading: isActivitiesLoading,
  } = useChannelActivities({
    channel,
    view,
    publishedAfter,
    maxResults,
  });

  const id = useMemo(
    () => activities?.map(({ videoId }) => videoId) || [],
    [activities]
  );

  const { data, error, isLoading } = useGetVideosByIdQuery({ id, maxResults });
  const videos = data || [];

  return {
    data:
      view === HomeView.Recent
        ? videos.filter(({ isRecent }) => isRecent)
        : videos,
    error: activitiesError || error,
    isLoading: isActivitiesLoading || isLoading,
  };
}
