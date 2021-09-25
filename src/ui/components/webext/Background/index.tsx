import React, { useEffect, useMemo, useRef } from 'react';
import {
  isWebExtension,
  setBadgeColors,
  setBadgeText,
  createTab,
  indexUrl,
  getBadgeText,
} from 'helpers/webext';
import { useAppSelector, useAppDispatch, storageKey } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import { setSettings } from 'store/reducers/settings';
import { setChannels } from 'store/reducers/channels';
import { setVideos } from 'store/reducers/videos';
import ChannelChecker from './ChannelChecker';
import { log } from './logger';
import { selectSettings } from 'store/selectors/settings';
import { debounce } from 'helpers/utils';

declare var browser: any;

interface BackgroundProps {}

export let isBackgroundPageRunning = false;

export function Background(props: BackgroundProps) {
  const badgeCount = useRef(0);
  const channels = useAppSelector(selectActiveChannels);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const openHomePage = () => {
    setBadgeText('');
    createTab(indexUrl);
  };

  const init = () => {
    setBadgeColors('#666', '#fff');
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
        dispatch(setChannels(channels.list));
        dispatch(setVideos(videos));
      }
    });
  };

  useEffect(() => {
    if (isWebExtension) {
      init();
      log('Background page initialised.');
      isBackgroundPageRunning = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBadge = useMemo(
    () =>
      debounce(async (count: number) => {
        const badgeText: string = await getBadgeText();
        if (badgeText.length) {
          count += +badgeText;
        }
        log('Updating badge:', count);
        setBadgeText(count);
        badgeCount.current = 0;
      }, 1000),
    []
  );

  const handleUpdate = (count: number) => {
    badgeCount.current += count;
    updateBadge(badgeCount.current);
  };

  return isWebExtension ? (
    <>
      {settings.enableNotifications
        ? channels
            .filter(({ notifications }) => !notifications?.isDisabled)
            .map((channel, index) => (
              <ChannelChecker
                key={index}
                channel={channel}
                onUpdate={handleUpdate}
              />
            ))
        : null}
    </>
  ) : (
    <span>This script is not intended to run on a webapp.</span>
  );
}
