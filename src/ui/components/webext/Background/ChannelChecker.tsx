import React, { useState, useEffect } from 'react';
import { Channel } from 'types';
import { useGetChannelVideosQuery } from 'store/services/youtube';
import { getDateBefore } from 'helpers/utils';
import { useAppSelector } from 'store';
import { selectViewedVideos } from 'store/selectors/videos';
import { getBadgeText, sendNotification, setBadgeText } from 'helpers/webext';
import { useTimeout } from 'hooks';
import { log } from './logger';

interface ChannelCheckerProps {
  channel: Channel;
}

const defaults = {
  checkInterval: 30, // minute(s)
  videosSeniority: 1, // day(s)
};

export default function ChannelChecker(props: ChannelCheckerProps) {
  const { channel } = props;
  const [ready, setReady] = useState(false);
  const [checkedVideos, setCheckedVideos] = useState<string[]>([]);
  const viewed = useAppSelector(selectViewedVideos);
  const publishedAfter = getDateBefore(defaults.videosSeniority).toISOString();
  const pollingInterval = defaults.checkInterval * 60000; // convert minutes to milliseconds
  const { data } = useGetChannelVideosQuery(
    {
      channel,
      publishedAfter,
    },
    {
      skip: !ready,
      pollingInterval,
    }
  );

  useTimeout(() => {
    setReady(true);
  }, pollingInterval);

  const updateBadge = async (count: number) => {
    const badgeText: string = await getBadgeText();
    if (badgeText.length) {
      // if badge text wasn't reseted yet (means that the user didn't yet notice it), we increment the total count
      count += +badgeText;
    }
    log('Updating badge:', count);
    setBadgeText(count);
  };

  useEffect(() => {
    const videos = data?.items || [];
    const total = data?.total || 0;
    if (total > 0) {
      const newVideos = videos.filter(
        (video) =>
          !viewed.includes(video.id) && !checkedVideos.includes(video.id)
      );
      if (newVideos.length > 0) {
        log(`New videos for channel ${channel.title}:`, newVideos);
        setCheckedVideos([...checkedVideos, ...newVideos.map(({ id }) => id)]);
        updateBadge(newVideos.length);
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
