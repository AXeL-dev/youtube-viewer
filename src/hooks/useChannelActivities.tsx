import { useAppSelector } from 'store';
import { selectWatchLaterVideos } from 'store/selectors/videos';
import { useGetChannelActivitiesQuery } from 'store/services/youtube';
import { Channel, ChannelActivities, HomeView } from 'types';

interface Props {
  channel: Channel;
  view: HomeView;
  publishedAfter: string;
  maxResults: number;
}

export function useChannelActivities({
  channel,
  view,
  publishedAfter,
  maxResults,
}: Props) {
  const channelActivities = useGetChannelActivitiesQuery(
    {
      channel,
      publishedAfter,
      maxResults,
    },
    { skip: !channel || view === HomeView.WatchLater }
  );
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos(channel));

  return view === HomeView.WatchLater
    ? {
        data: watchLaterVideos as ChannelActivities[],
        error: false,
        isLoading: false,
      }
    : channelActivities;
}
