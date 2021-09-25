import React, { useState, useEffect, useRef } from 'react';
import { Channel } from 'types';
import { useGetChannelVideosQuery } from 'store/services/youtube';
import { getDateBefore } from 'helpers/utils';
import { useAppSelector } from 'store';
import { selectViewedVideos } from 'store/selectors/videos';
import { sendNotification } from 'helpers/webext';
import { useInterval } from 'hooks';
import { log } from './logger';

interface ChannelCheckerProps {
  channel: Channel;
  onUpdate: (count: number) => void;
}

const defaults = {
  checkInterval: 30, // minute(s)
  videosSeniority: 1, // day(s)
};

export default function ChannelChecker(props: ChannelCheckerProps) {
  const { channel, onUpdate } = props;
  const [ready, setReady] = useState(false);
  const checkedVideos = useRef<string[]>([]);
  const viewed = useAppSelector(selectViewedVideos);
  const publishedAfter = getDateBefore(defaults.videosSeniority).toISOString();
  const pollingInterval = defaults.checkInterval * 60000; // convert minutes to milliseconds
  const { data, refetch } = useGetChannelVideosQuery(
    {
      channel,
      publishedAfter,
    },
    {
      skip: !ready,
      // pollingInterval,
    }
  );

  useInterval(() => {
    if (!ready) {
      setReady(true);
    } else {
      refetch();
    }
  }, pollingInterval);

  useEffect(() => {
    const videos = data?.items || [];
    const total = data?.total || 0;
    log('Data changed:', total, data);
    if (total > 0) {
      const newVideos = videos.filter(
        (video) =>
          !viewed.includes(video.id) &&
          !checkedVideos.current.includes(video.id)
      );
      if (newVideos.length > 0) {
        log(`New videos for channel ${channel.title}:`, newVideos);
        checkedVideos.current.push(...newVideos.map(({ id }) => id));
        onUpdate(newVideos.length);
        sendNotification({
          id: `${new Date().getTime()}::${channel.id}`,
          message: `${channel.title} posted ${newVideos.length} recent video${
            newVideos.length > 1 ? 's' : ''
          }`,
          // items: newVideos.map((video) => ({ // only if notification type is 'list'
          //   title: video.title,
          //   message: video.url,
          // })),
          // contextMessage: channel.url,
          // buttons: [
          //   {
          //     title: 'Open channel',
          //   },
          // ],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <span>Silence is golden!</span>;
}
