import { useState, useEffect } from 'react';
import { Channel, Video } from 'types';
import { useGetChannelVideosQuery } from 'store/services/youtube';
import { getDateBefore } from 'helpers/utils';
import { useAppSelector } from 'store';
import { selectChannelVideos } from 'store/selectors/videos';
import { useInterval, useStateRef } from 'hooks';
import { log } from 'helpers/logger';

export interface CheckEndData {
  channel: Channel;
  newVideos: Video[];
}

interface ChannelCheckerProps {
  channel: Channel;
  onCheckEnd: (data: CheckEndData) => void;
}

export const config = {
  checkInterval: 30, // minute(s)
  videosSeniority: 1, // day(s)
};

export default function ChannelChecker(props: ChannelCheckerProps) {
  const { channel, onCheckEnd } = props;
  const [ready, setReady] = useState(false);
  const cachedVideos = useAppSelector(selectChannelVideos(channel));
  const cachedVideosRef = useStateRef(cachedVideos);
  const publishedAfter = getDateBefore(config.videosSeniority).toISOString();
  const pollingInterval = config.checkInterval * 60000; // convert minutes to milliseconds
  const { data, isFetching, refetch } = useGetChannelVideosQuery(
    {
      channel,
      publishedAfter,
    },
    {
      skip: !ready,
      // pollingInterval,
    },
  );

  useInterval(() => {
    if (!navigator.onLine) {
      return;
    }
    if (!ready) {
      setReady(true);
    } else {
      refetch();
    }
  }, pollingInterval);

  useEffect(() => {
    if (!isFetching && data) {
      let newVideos: Video[] = [];
      const videos = data?.items || [];
      const total = data?.total || 0;
      log('Fetch ended:', total, data);
      if (total > 0) {
        const checkedVideosIds = cachedVideosRef.current
          .filter(
            ({ flags }) =>
              flags.seen ||
              flags.toWatchLater ||
              flags.bookmarked ||
              flags.notified ||
              flags.recent,
          )
          .map(({ id }) => id);
        newVideos = videos.filter(
          (video) => !checkedVideosIds.includes(video.id),
        );
        if (newVideos.length > 0) {
          log(`New videos for channel ${channel.title}:`, newVideos);
        }
      }
      onCheckEnd({
        channel,
        newVideos,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  return null;
}
