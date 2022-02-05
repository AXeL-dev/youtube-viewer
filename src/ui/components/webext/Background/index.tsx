import React, { useEffect, useRef } from 'react';
import {
  isWebExtension,
  setBadgeColors,
  setBadgeText,
  getBadgeText,
  sendNotification,
} from 'helpers/webext';
import { useAppSelector } from 'store';
import { selectNotificationEnabledChannels } from 'store/selectors/channels';
import { saveVideos, removeOutdatedVideos } from 'store/reducers/videos';
import { log } from 'helpers/logger';
import { selectSettings } from 'store/selectors/settings';
import { Video } from 'types';
import { selectApp } from 'store/selectors/app';
import { dispatch } from 'store';
import EventsHandler, { EventsHandlerRef } from './EventsHandler';
import ChannelChecker, { CheckEndData } from './ChannelChecker';

interface BackgroundProps {}

export function Background(props: BackgroundProps) {
  const responses = useRef<CheckEndData[]>([]);
  const eventsHandlerRef = useRef<EventsHandlerRef>(null);
  const channels = useAppSelector(selectNotificationEnabledChannels);
  const settings = useAppSelector(selectSettings);
  const app = useAppSelector(selectApp);

  useEffect(() => {
    if (!isWebExtension) {
      return;
    }
    setBadgeColors({
      backgroundColor: '#666',
      textColor: '#fff',
    });
  }, []);

  useEffect(() => {
    if (settings.enableNotifications) {
      responses.current = [];
    }
  }, [settings.enableNotifications]);

  useEffect(() => {
    if (!isWebExtension) {
      return;
    }
    if (app.loaded) {
      log('Removing outdated videos.');
      dispatch(removeOutdatedVideos(), true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.loaded]);

  const updateBadge = async (count: number) => {
    const badgeText: string = await getBadgeText();
    if (badgeText.length) {
      count += +badgeText;
    }
    log('Updating badge:', count);
    setBadgeText(count);
  };

  const handleCheckEnd = (data: CheckEndData) => {
    responses.current.push(data);
    // Once all channel checkers responded to us
    if (responses.current.length === channels.length) {
      // Save last check date
      eventsHandlerRef.current?.setLastCheckDate(new Date());
      // Get total count of new videos
      const count = responses.current.reduce(
        (acc, cur) => acc + cur.newVideos.length,
        0
      );
      log('All channel checkers responded, new videos count:', count);
      // Update badge count & send notification
      if (count > 0) {
        updateBadge(count);
        const maxChannelTitles = 5;
        const fulfilledResponses = responses.current.filter(
          ({ newVideos }) => newVideos.length > 0
        );
        const channelTitles = fulfilledResponses
          .slice(0, Math.min(maxChannelTitles, fulfilledResponses.length))
          .map(({ channel }) => channel.title)
          .join(', ');
        sendNotification({
          title: `YouTube viewer (${count} new video${count > 1 ? 's' : ''})`,
          message: `Posted by ${channelTitles}${
            fulfilledResponses.length > maxChannelTitles ? ' & others' : ''
          }.`,
          // id: `${new Date().getTime()}::${channel.id}`,
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
        // Save notified videos
        const videos = fulfilledResponses.reduce(
          (acc: Video[], cur: CheckEndData) => [...acc, ...cur.newVideos],
          []
        );
        log('Saving notified videos.', videos);
        dispatch(
          saveVideos({
            videos,
            flags: {
              notified: true,
            },
          }),
          true
        );
      }
      // Reset the responses array
      responses.current = [];
    }
  };

  return isWebExtension ? (
    <>
      <EventsHandler ref={eventsHandlerRef} channels={channels} />
      {app.loaded && settings.enableNotifications
        ? channels.map((channel, index) => (
            <ChannelChecker
              key={index}
              channel={channel}
              onCheckEnd={handleCheckEnd}
            />
          ))
        : null}
    </>
  ) : (
    <span>This script is not intended to run on a webapp.</span>
  );
}
