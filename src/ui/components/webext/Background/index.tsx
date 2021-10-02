import React, { useEffect, useRef } from 'react';
import {
  isWebExtension,
  setBadgeColors,
  setBadgeText,
  createTab,
  indexUrl,
  getBadgeText,
  sendNotification,
} from 'helpers/webext';
import { useAppSelector, storageKey } from 'store';
import { selectNotificationEnabledChannels } from 'store/selectors/channels';
import { setSettings } from 'store/reducers/settings';
import { setChannels } from 'store/reducers/channels';
import {
  addNotifiedVideos,
  removeOutdatedVideos,
  setVideos,
} from 'store/reducers/videos';
import ChannelChecker, { CheckEndData } from './ChannelChecker';
import { log } from 'helpers/logger';
import { selectSettings } from 'store/selectors/settings';
import { MessageRequest, Video } from 'types';
import { selectApp } from 'store/selectors/app';
import { dispatch } from 'store/persist';

declare var browser: any;

interface BackgroundProps {}

export function Background(props: BackgroundProps) {
  const responses = useRef<CheckEndData[]>([]);
  const lastCheckDate = useRef<Date | null>(null);
  const channels = useAppSelector(selectNotificationEnabledChannels);
  const settings = useAppSelector(selectSettings);
  const app = useAppSelector(selectApp);

  useEffect(() => {
    if (settings.enableNotifications) {
      responses.current = [];
    }
  }, [settings.enableNotifications]);

  const openHomePage = () => {
    setBadgeText('');
    createTab(indexUrl);
  };

  const handleMessage = (
    request: MessageRequest,
    sender: any,
    sendResponse: any
  ) => {
    log('Handle message:', request);
    let response: any = null;
    return new Promise((resolve) => {
      switch (request.message) {
        // getLastCheckDate
        case 'getLastCheckDate':
          response = lastCheckDate.current;
          break;
        // default
        default:
          break;
      }
      log('response:', response);
      resolve(response);
    });
  };

  const init = () => {
    setBadgeColors('#666', '#fff');
    // Handle messages
    browser.runtime.onMessage.addListener(handleMessage);
    // Handle click on notifications
    browser.notifications.onClicked.addListener((notificationId: string) => {
      log('Notification clicked:', notificationId);
      openHomePage();
    });
    browser.notifications.onButtonClicked.addListener(
      (notificationId: string, buttonIndex: number) => {
        log(`Notification button ${buttonIndex} clicked:`, notificationId);
        log('channels', channels);
        const [, channelId] = notificationId.split('::');
        const url = channels.find((channel) => channel.id === channelId)?.url;
        if (url?.length) {
          createTab(url);
        }
      }
    );
    // Handle click on browser action
    // only works if "browser_action" > "default_popup" is not set on manifest
    browser.browserAction.onClicked.addListener((tab: any) => {
      log('Browser action clicked:', tab);
      openHomePage();
    });
    // Handle storage change
    browser.storage.onChanged.addListener((changes: any, areaName: string) => {
      log('Storage changed:', areaName, changes);
      if (areaName === 'local') {
        const { settings, channels, videos } = changes[storageKey].newValue;
        dispatch(setSettings(settings));
        dispatch(setChannels(channels));
        dispatch(setVideos(videos));
      }
    });
  };

  useEffect(() => {
    if (isWebExtension) {
      init();
      log('Background page initialised.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isWebExtension && app.loaded) {
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
      lastCheckDate.current = new Date();
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
        dispatch(addNotifiedVideos(videos), true);
      }
      // Reset the responses array
      responses.current = [];
    }
  };

  return isWebExtension ? (
    <>
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
