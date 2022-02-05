import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import {
  isWebExtension,
  setBadgeText,
  createTab,
  openPage,
} from 'helpers/webext';
import { storageKey } from 'store';
import { setSettings } from 'store/reducers/settings';
import { setChannels } from 'store/reducers/channels';
import { setVideos } from 'store/reducers/videos';
import { log } from 'helpers/logger';
import { Channel, Nullable, MessageRequest } from 'types';
import { dispatch } from 'store';

declare var browser: any;

export interface EventsHandlerRef {
  setLastCheckDate: (date: Date) => void;
}

interface EventsHandlerProps {
  channels: Channel[];
}

const EventsHandler = forwardRef<EventsHandlerRef, EventsHandlerProps>(
  (props, ref) => {
    const { channels } = props;
    const lastCheckDate = useRef<Nullable<Date>>(null);

    useImperativeHandle(
      ref,
      () => ({
        setLastCheckDate: (date: Date) => {
          lastCheckDate.current = date;
        },
      }),
      []
    );

    const openHomePage = () => {
      setBadgeText('');
      openPage('/');
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

    const handleNotificationClick = (notificationId: string) => {
      log('Notification clicked:', notificationId);
      openHomePage();
    };

    const handleNotificationButtonClick = (
      notificationId: string,
      buttonIndex: number
    ) => {
      log(`Notification button ${buttonIndex} clicked:`, notificationId);
      log('channels', channels);
      const [, channelId] = notificationId.split('::');
      const url = channels.find((channel) => channel.id === channelId)?.url;
      if (url?.length) {
        createTab(url);
      }
    };

    const handleBrowserActionClick = (tab: any) => {
      log('Browser action clicked:', tab);
      openHomePage();
    };

    const handleStorageChange = (changes: any, areaName: string) => {
      log('Storage changed:', areaName, changes);
      if (areaName === 'local') {
        const { settings, channels, videos } = changes[storageKey].newValue;
        dispatch(setSettings(settings));
        dispatch(setChannels(channels));
        dispatch(setVideos(videos));
      }
    };

    useEffect(() => {
      if (!isWebExtension) {
        return;
      }
      log('Background page: registering event listeners.');
      // Handle messages
      browser.runtime.onMessage.addListener(handleMessage);
      // Handle click on notifications
      browser.notifications.onClicked.addListener(handleNotificationClick);
      browser.notifications.onButtonClicked.addListener(
        handleNotificationButtonClick
      );
      // Handle click on browser action
      // only works if "browser_action" > "default_popup" is not set on manifest
      browser.browserAction.onClicked.addListener(handleBrowserActionClick);
      // Handle storage change
      browser.storage.onChanged.addListener(handleStorageChange);

      return () => {
        browser.runtime.onMessage.removeListener(handleMessage);
        browser.notifications.onClicked.removeListener(handleNotificationClick);
        browser.notifications.onButtonClicked.removeListener(
          handleNotificationButtonClick
        );
        browser.browserAction.onClicked.removeListener(
          handleBrowserActionClick
        );
        browser.storage.onChanged.removeListener(handleStorageChange);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  }
);

export default EventsHandler;
