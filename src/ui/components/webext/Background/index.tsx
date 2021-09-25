import React, { useEffect } from 'react';
import {
  isWebExtension,
  setBadgeColors,
  setBadgeText,
  createTab,
  getUrl,
} from 'helpers/webext';
import { useAppSelector, useAppDispatch, stateKey } from 'store';
import { selectActiveChannels } from 'store/selectors/channels';
import { setSettings } from 'store/reducers/settings';
import { setChannels } from 'store/reducers/channels';
import { setVideos } from 'store/reducers/videos';
import ChannelChecker from './ChannelChecker';
import { log } from './logger';

declare var browser: any;

interface BackgroundProps {}

export let isBackgroundPageRunning = false;

export function Background(props: BackgroundProps) {
  const channels = useAppSelector(selectActiveChannels);
  const dispatch = useAppDispatch();

  const init = () => {
    setBadgeColors('#666', '#fff');
    const indexUrl = getUrl('index.html');
    // Handle click on notifications
    browser.notifications.onClicked.addListener((notificationId: string) => {
      log('Notification clicked:', notificationId);
      createTab(indexUrl);
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
      setBadgeText('');
      createTab(indexUrl);
    });
    // Handle storage change
    browser.storage.onChanged.addListener((changes: any, areaName: string) => {
      log('Storage changed:', areaName, changes);
      if (areaName === 'local') {
        const { settings, channels, videos } = changes[stateKey].newValue;
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

  return isWebExtension ? (
    <>
      {channels
        .filter(({ notifications }) => !notifications?.isDisabled)
        .map((channel, index) => (
          <ChannelChecker key={index} channel={channel} />
        ))}
    </>
  ) : (
    <span>This script is not intended to run on a webapp.</span>
  );
}
